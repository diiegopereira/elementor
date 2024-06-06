import { test, expect } from '@playwright/test';
import WpAdminPage from '../pages/wp-admin-page';
import ImageCarousel from '../pages/widgets/image-carousel';
import EditorPage from '../pages/editor-page';

test( 'Basic Gallery', async ( { page }, testInfo ) => {
	// Arrange.
	const wpAdmin = new WpAdminPage( page, testInfo );
	const editor = await wpAdmin.openNewPage();
	const imageCarousel = new ImageCarousel( page, testInfo );

	await editor.closeNavigatorIfOpen();
	await editor.addWidget( 'image-gallery' );

	// Act.
	await imageCarousel.addImageGallery();

	await editor.togglePreviewMode();
	expect( await editor.getPreviewFrame()
		.locator( 'div#gallery-1' )
		.screenshot( { type: 'jpeg', quality: 90 } ) )
		.toMatchSnapshot( 'gallery.jpeg' );
} );

test( 'Basic Gallery Lightbox', async ( { page }, testInfo ) => {
	// Arrange.
	const wpAdmin = new WpAdminPage( page, testInfo );
	const imageCarousel = new ImageCarousel( page, testInfo );
	const editor = await wpAdmin.openNewPage();

	await editor.closeNavigatorIfOpen();
	await editor.addWidget( 'image-gallery' );

	// Act.
	await testBasicSwiperGallery( editor, imageCarousel );
} );

async function testBasicSwiperGallery( editor: EditorPage, imageCarousel: ImageCarousel ) {
	// Act.
	await imageCarousel.addImageGallery();

	await editor.togglePreviewMode();
	await editor.getPreviewFrame().locator( 'div#gallery-1 img' ).first().click();
	await editor.page.waitForTimeout( 1000 );
	await editor.getPreviewFrame().locator( '.swiper-slide-active img[data-title="A"]' ).waitFor();
	await editor.getPreviewFrame().locator( '.elementor-swiper-button-next' ).first().click();
	await editor.getPreviewFrame().locator( '.swiper-slide-active img[data-title="B"]' ).waitFor();

	await expect( editor.getPreviewFrame().locator( '.elementor-lightbox' ) )
		.toHaveScreenshot( 'gallery-lightbox-swiper.png' );
}
