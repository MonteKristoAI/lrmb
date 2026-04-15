// JavaScript Document

jQuery(document).ready(function ($) {

	// make Divi Search Module search WooCommerce products
	jQuery("input[name=et_pb_searchform_submit]").remove();

	//populate element with CSS ID this-year with current year
	if ($("#this-year").length) {
		document.getElementById("this-year").innerHTML = new Date().getFullYear();
	}

});