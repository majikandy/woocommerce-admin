/** @format */

/**
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WooCommerce dependencies
 */
import { ORDER_STATUSES } from '@woocommerce/settings';

/**
 * Use `OrderStatus` to display a badge with human-friendly text describing the current order status.
 *
 * @return { object } -
 */
const OrderStatus = ( { order, className } ) => {
	const { status } = order;
	const classes = classnames( 'woocommerce-order-status', className );
	const indicatorClasses = classnames( 'woocommerce-order-status__indicator', {
		[ 'is-' + status ]: true,
	} );
	const label = ORDER_STATUSES[ status ] || status;
	return (
		<div className={ classes }>
			<span className={ indicatorClasses } />
			{ label }
		</div>
	);
};

OrderStatus.propTypes = {
	/**
	 * The order to display a status for.
	 */
	order: PropTypes.object.isRequired,
	/**
	 * Additional CSS classes.
	 */
	className: PropTypes.string,
};

export default OrderStatus;
