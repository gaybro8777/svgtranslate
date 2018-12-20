/**
 * Add ULS to the target-language button.
 */
$( function () {
	var targetLangButton,
		$targetLangButton = $( '.target-lang-widget' );
	if ( $targetLangButton.length === 0 ) {
		// If the widget isn't present, do nothing.
		return;
	}
	function onSelectTargetLang( language ) {
		// Save the language name and code in the widget.
		this.setLabel( $.uls.data.languages[ language ][ 2 ] );
		this.setData( language );
		// Also switch what's displayed in the form when a new language is selected in the ULS.
		$( '.translation-fields .oo-ui-fieldLayout' ).each( function () {
			var field = OO.ui.infuse( $( this ) ).getField();
			if ( appConfig.translations[ field.data.nodeId ] &&
				appConfig.translations[ field.data.nodeId ][ language ]
			) {
				// If there's a translation available, set the field's value.
				field.setValue( appConfig.translations[ field.data.nodeId ][ language ].text );
			} else {
				// Otherwise, blank the field.
				field.setValue( '' );
			}
		} );
	}
	targetLangButton = OO.ui.infuse( $targetLangButton );
	targetLangButton.$element.uls( {
		onSelect: onSelectTargetLang.bind( targetLangButton ),
		// Add the preferred languages as the quick-list.
		quickList: App.getCookieVal( 'preferredLangs', [] ),
		// @HACK: Re-align the ULS menu because we're customizing its layout in translate.less.
		left: targetLangButton.$element.offset().left
	} );
} );

/**
 * Switch displayed 'from' language.
 */
$( function () {
	var sourceLangWidget,
		$sourceLangWidget = $( '.source-lang-widget' );
	if ( $sourceLangWidget.length !== 1 ) {
		// Don't do anything if the widget isn't present.
		return;
	}
	sourceLangWidget = OO.ui.infuse( $sourceLangWidget[ 0 ] );
	sourceLangWidget.on( 'change', function () {
		var newLangCode = sourceLangWidget.getValue();
		// Go through all the field labels and fetch new values from the translations.
		$( '.translation-fields .oo-ui-fieldLayout' ).each( function () {
			var fieldLayout = OO.ui.infuse( $( this ) ),
				nodeId = fieldLayout.getField().data.nodeId;
			if ( appConfig.translations[ nodeId ][ newLangCode ] === undefined ) {
				// If there's no source language available for a string,
				// show a message and the fallback language.
				fieldLayout.setLabel( $.i18n(
					'source-lang-not-found',
					[ appConfig.translations[ nodeId ].fallback.text ]
				) );
				fieldLayout.$element.addClass( 'source-lang-not-found' );
			} else {
				// Where available, set the source language string.
				fieldLayout.setLabel( appConfig.translations[ nodeId ][ newLangCode ].text );
			}
		} );
	} );
} );

/**
 * Add LeafletJS to image, for zooming and panning.
 */
$( function () {
	var imagemap, $imageElement,
		$imageWrapper = $( '#translation-image' );
	if ( $imageWrapper.length !== 1 ) {
		// Don't do anything if the translation image isn't present.
		return;
	}
	$imageElement = $imageWrapper.find( 'img' );
	$imageElement.css( 'visibility', 'hidden' );
	$imageWrapper.css( {
		height: '80vh',
		width: 'auto'
	} );
	imagemap = L.map( $imageWrapper.attr( 'id' ), {
		crs: L.CRS.Simple,
		center: [ $imageElement.height() / 2, $imageElement.width() / 2 ],
		zoom: 0
	} );
	L.imageOverlay( $imageElement.attr( 'src' ), [ [ 0, 0 ], [ $imageElement.height(), $imageElement.width() ] ] )
		.addTo( imagemap );
} );
