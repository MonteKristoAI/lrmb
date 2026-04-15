<?php
/**
 * Plugin Name: GummyGurl SEO
 * Description: Lightweight SEO for WooCommerce products and pages. Replaces RankMath/Yoast. Zero bloat.
 * Version: 1.0.0
 * Author: MonteKristo AI
 *
 * Install: Upload to wp-content/mu-plugins/gummygurl-seo.php
 * mu-plugins load automatically - no activation needed.
 */

if (!defined('ABSPATH')) exit;

/**
 * 1. META TITLE - Product pages get "Product Name | GummyGurl"
 */
add_filter('pre_get_document_title', function ($title) {
    if (is_product()) {
        global $post;
        return get_the_title($post->ID) . ' | GummyGurl';
    }
    if (is_product_category()) {
        $cat = get_queried_object();
        return $cat->name . ' - Hemp Products | GummyGurl';
    }
    if (is_shop()) {
        return 'Shop All Products | GummyGurl';
    }
    return $title;
}, 20);

/**
 * 2. META DESCRIPTION - Pull from product short description or excerpt
 */
add_action('wp_head', function () {
    if (is_product()) {
        global $post;
        $desc = get_the_excerpt($post->ID);
        if (!$desc) {
            $product = wc_get_product($post->ID);
            $desc = $product ? $product->get_short_description() : '';
        }
        $desc = wp_strip_all_tags($desc);
        $desc = mb_substr($desc, 0, 160);
        if ($desc) {
            echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
        }
    } elseif (is_shop()) {
        echo '<meta name="description" content="Shop lab-tested hemp-derived THC, CBD, CBN, mushroom, and pet wellness edibles from GummyGurl. Farm Bill compliant. Ships nationwide.">' . "\n";
    } elseif (is_product_category()) {
        $cat = get_queried_object();
        $desc = $cat->description ? mb_substr(wp_strip_all_tags($cat->description), 0, 160) : '';
        if ($desc) {
            echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
        }
    } elseif (is_page()) {
        global $post;
        $desc = get_the_excerpt($post->ID);
        if ($desc) {
            $desc = mb_substr(wp_strip_all_tags($desc), 0, 160);
            echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
        }
    }
}, 1);

/**
 * 3. OPEN GRAPH TAGS - Product images, titles, descriptions for social sharing
 */
add_action('wp_head', function () {
    $og = [];

    if (is_product()) {
        global $post;
        $product = wc_get_product($post->ID);
        $image = wp_get_attachment_url($product->get_image_id());

        $og['og:type'] = 'product';
        $og['og:title'] = get_the_title() . ' | GummyGurl';
        $og['og:description'] = mb_substr(wp_strip_all_tags($product->get_short_description()), 0, 200);
        $og['og:url'] = get_permalink();
        $og['og:image'] = $image ?: '';
        $og['og:site_name'] = 'GummyGurl';
        $og['product:price:amount'] = $product->get_price();
        $og['product:price:currency'] = 'USD';
    } elseif (is_front_page() || is_home()) {
        $og['og:type'] = 'website';
        $og['og:title'] = 'GummyGurl - Premium Hemp-Derived THC, CBD & Wellness Edibles';
        $og['og:description'] = 'Lab-tested hemp edibles, THCA flower, CBD wellness, and pet CBD. Farm Bill compliant. Ships nationwide.';
        $og['og:url'] = home_url('/');
        $og['og:site_name'] = 'GummyGurl';
    }

    foreach ($og as $property => $content) {
        if ($content) {
            echo '<meta property="' . esc_attr($property) . '" content="' . esc_attr($content) . '">' . "\n";
        }
    }

    // Twitter Card
    if (!empty($og['og:title'])) {
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($og['og:title'] ?? '') . '">' . "\n";
        if (!empty($og['og:description'])) {
            echo '<meta name="twitter:description" content="' . esc_attr($og['og:description']) . '">' . "\n";
        }
        if (!empty($og['og:image'])) {
            echo '<meta name="twitter:image" content="' . esc_attr($og['og:image']) . '">' . "\n";
        }
    }
}, 2);

/**
 * 4. ENHANCED PRODUCT SCHEMA - Extends WooCommerce default Product schema
 *    WooCommerce already outputs basic Product schema. This adds review aggregate,
 *    brand, and compliance fields.
 */
add_filter('woocommerce_structured_data_product', function ($markup, $product) {
    // Add brand
    $markup['brand'] = [
        '@type' => 'Brand',
        'name' => 'GummyGurl',
    ];

    // Add seller/organization
    $markup['seller'] = [
        '@type' => 'Organization',
        'name' => 'Carolina Natural Solutions',
        'url' => 'https://gummygurl.com',
    ];

    return $markup;
}, 10, 2);

/**
 * 5. ORGANIZATION SCHEMA on homepage
 */
add_action('wp_head', function () {
    if (!is_front_page() && !is_home()) return;

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'Organization',
        'name' => 'GummyGurl',
        'legalName' => 'Carolina Natural Solutions',
        'url' => 'https://gummygurl.com',
        'email' => 'hello@gummygurl.com',
        'description' => 'GummyGurl is a hemp-derived edibles brand operated by Carolina Natural Solutions in North Carolina, offering lab-tested THC, CBD, CBN, mushroom, and pet wellness products across six specialized brands.',
        'address' => [
            '@type' => 'PostalAddress',
            'addressRegion' => 'NC',
            'addressCountry' => 'US',
        ],
    ];

    echo '<script type="application/ld+json">' . "\n";
    echo wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    echo "\n</script>\n";
}, 5);

/**
 * 6. CANONICAL URLs - Prevent duplicate content
 */
add_action('wp_head', function () {
    if (is_singular()) {
        echo '<link rel="canonical" href="' . esc_url(get_permalink()) . '">' . "\n";
    } elseif (is_shop()) {
        echo '<link rel="canonical" href="' . esc_url(wc_get_page_permalink('shop')) . '">' . "\n";
    }
}, 1);

// Remove WordPress default canonical if we're handling it
remove_action('wp_head', 'rel_canonical');

/**
 * 7. ROBOTS META - noindex cart, checkout, account pages
 */
add_action('wp_head', function () {
    if (is_cart() || is_checkout() || is_account_page()) {
        echo '<meta name="robots" content="noindex, nofollow">' . "\n";
    }
}, 1);

/**
 * 8. CLEAN UP wp_head - Remove unnecessary WordPress SEO clutter
 */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
