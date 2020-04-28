<?php
/**
 * Plugin version rule processor tests.
 *
 * @package WooCommerce\Tests\Rinds
 */

use Automattic\WooCommerce\Admin\Rinds\PluginVersionRuleProcessor;

/**
 * class WC_Tests_Rinds_PluginVersionRuleProcessor
 */
class WC_Tests_Rinds_PluginVersionRuleProcessor extends WC_Unit_Test_Case {
	/**
	 * Test that the processor does not pass if the plugin is not activated.
	 *
	 * @group fast
	 */
	public function test_spec_does_not_pass_if_plugin_not_activated() {
		$mock_plugins_provider = new MockPluginsProvider( array(), array() );
		$processor             = new PluginVersionRuleProcessor( $mock_plugins_provider );
		$rule                  = json_decode(
			'{
				"type": "plugin_version",
				"plugin": "jetpack",
				"version": "1.2.3",
				"operator": "<"
			}'
		);

		$result = $processor->process( $rule );

		$this->assertEquals( false, $result );
	}

	/**
	 * Test that the processor does not pass if the plugin is not activated.
	 *
	 * @group fast
	 */
	public function test_spec_does_not_pass_if_plugin_not_in_data() {
		$mock_plugins_provider = new MockPluginsProvider(
			array(
				'jetpack',
			),
			array()
		);
		$processor             = new PluginVersionRuleProcessor( $mock_plugins_provider );
		$rule                  = json_decode(
			'{
				"type": "plugin_version",
				"plugin": "jetpack",
				"version": "1.2.3",
				"operator": "<"
			}'
		);

		$result = $processor->process( $rule );

		$this->assertEquals( false, $result );
	}

	/**
	 * Test that the processor does not pass if the installed version is less
	 * than the required version.
	 *
	 * @group fast
	 */
	public function test_spec_does_not_pass_if_installed_version_less_than_required_version() {
		$mock_plugins_provider = new MockPluginsProvider(
			array(
				'jetpack',
			),
			array(
				'jetpack/jetpack.php' => array(
					'Version' => '1.2.4',
				),
			)
		);
		$processor             = new PluginVersionRuleProcessor( $mock_plugins_provider );
		$rule                  = json_decode(
			'{
				"type": "plugin_version",
				"plugin": "jetpack",
				"version": "1.2.3",
				"operator": "<"
			}'
		);

		$result = $processor->process( $rule );

		$this->assertEquals( false, $result );
	}

	/**
	 * Test that the processor passes if the installed version is equal
	 * to the required version.
	 *
	 * @group fast
	 */
	public function test_spec_passes_if_installed_version_equals_required_version() {
		$mock_plugins_provider = new MockPluginsProvider(
			array(
				'jetpack',
			),
			array(
				'jetpack/jetpack.php' => array(
					'Version' => '1.2.3',
				),
			)
		);
		$processor             = new PluginVersionRuleProcessor( $mock_plugins_provider );
		$rule                  = json_decode(
			'{
				"type": "plugin_version",
				"plugin": "jetpack",
				"version": "1.2.3",
				"operator": "="
			}'
		);

		$result = $processor->process( $rule );

		$this->assertEquals( true, $result );
	}

	/**
	 * Test that the processor passes if the installed version is later than
	 * the required version.
	 *
	 * @group fast
	 */
	public function test_spec_passes_if_installed_version_is_later_than_required_version() {
		$mock_plugins_provider = new MockPluginsProvider(
			array(
				'jetpack',
			),
			array(
				'jetpack/jetpack.php' => array(
					'Version' => '1.2.4',
				),
			)
		);
		$processor             = new PluginVersionRuleProcessor( $mock_plugins_provider );
		$rule                  = json_decode(
			'{
				"type": "plugin_version",
				"plugin": "jetpack",
				"version": "1.2.3",
				"operator": ">"
			}'
		);

		$result = $processor->process( $rule );

		$this->assertEquals( true, $result );
	}
}
