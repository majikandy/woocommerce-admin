/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment /*, useEffect */ } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import Gridicon from 'gridicons';

/**
 * WooCommerce dependencies
 */
import { useUserPreferences } from '@woocommerce/data';

/**
 * Internal dependencies
 */
import { ActivityCard, ActivityCardPlaceholder } from '../../activity-card';
import ActivityHeader from '../../activity-header';
import InboxNoteCard from './card';
import { EmptyContent, Section } from '@woocommerce/components';
import { QUERY_DEFAULTS } from 'wc-api/constants';
import withSelect from 'wc-api/with-select';

const renderEmptyCard = () => (
	<ActivityCard
		className="woocommerce-empty-activity-card"
		title={ __( 'Your inbox is empty', 'woocommerce-admin' ) }
		icon={ <Gridicon icon="checkmark" size={ 48 } /> }
	>
		{ __(
			'As things begin to happen in your store your inbox will start to fill up. ' +
				"You'll see things like achievements, new feature announcements, extension recommendations and more!",
			'woocommerce-admin'
		) }
	</ActivityCard>
);

const renderNotes = ( { lastRead, notes } ) => {
	if ( Object.keys( notes ).length === 0 ) {
		return renderEmptyCard();
	}

	const notesArray = Object.keys( notes ).map( ( key ) => notes[ key ] );

	return notesArray.map( ( note ) => (
		<InboxNoteCard
			key={ note.id }
			note={ note }
			lastRead={ lastRead }
		/>
	) );
}

const InboxPanel = ( props ) => {
	const { isError, isRequesting, notes } = props;
	const { /* updateUserPreferences, */ ...userPrefs } = useUserPreferences();
	const lastRead = userPrefs.activity_panel_inbox_last_read;

	// @todo - this is apparently NOT the right way to do this!
	// useEffect( () => {
	// 	const mountTime = Date.now();
	// 
	// 	return () => {
	// 		console.log( 'updating last read', mountTime );
	// 		const userDataFields = {
	// 			activity_panel_inbox_last_read: mountTime,
	// 		};
	// 		updateUserPreferences( userDataFields );
	// 	};
	// } );

	if ( isError ) {
		const title = __(
			'There was an error getting your inbox. Please try again.',
			'woocommerce-admin'
		);
		const actionLabel = __( 'Reload', 'woocommerce-admin' );
		const actionCallback = () => {
			// @todo Add tracking for how often an error is displayed, and the reload action is clicked.
			window.location.reload();
		};

		return (
			<Fragment>
				<EmptyContent
					title={ title }
					actionLabel={ actionLabel }
					actionURL={ null }
					actionCallback={ actionCallback }
				/>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<ActivityHeader title={ __( 'Inbox', 'woocommerce-admin' ) } />
			<Section>
				{ isRequesting ? (
					<ActivityCardPlaceholder
						className="woocommerce-inbox-activity-card"
						hasAction
						hasDate
						lines={ 2 }
					/>
				) : (
					renderNotes( { lastRead, notes })
				) }
			</Section>
		</Fragment>
	);
}

export default compose(
	withSelect( ( select ) => {
		const {
			getNotes,
			getNotesError,
			isGetNotesRequesting,
		} = select( 'wc-api' );
		const inboxQuery = {
			page: 1,
			per_page: QUERY_DEFAULTS.pageSize,
			type: 'info,warning',
			orderby: 'date',
			order: 'desc',
			status: 'unactioned',
			_fields: [
				'id',
				'name',
				'title',
				'content',
				'type',
				'icon',
				'status',
				'actions',
				'date_created',
				'date_created_gmt',
			],
		};

		const notes = getNotes( inboxQuery );
		const isError = Boolean( getNotesError( inboxQuery ) );
		const isRequesting = isGetNotesRequesting( inboxQuery );

		return {
			notes,
			isError,
			isRequesting,
		};
	} )
)( InboxPanel );
