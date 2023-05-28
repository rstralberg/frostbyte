<?php

// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Returns All Favicons 
//

function generate_favicons($config)
{
    $html = '';
    // most commom favicons
    $favicons = [
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-57x57.png', 'sizes' => '57x57'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-60x60.png', 'sizes' => '60x60'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-72x72.png', 'sizes' => '72x72'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-76x76.png', 'sizes' => '76x76'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-114x114.png', 'sizes' => '114x114'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-120x120.png', 'sizes' => '120x120'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-144x144.png', 'sizes' => '144x144'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-152x152.png', 'sizes' => '152x152'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-180x180.png', 'sizes' => '180x180'],
    ['rel' => 'icon', 'href' => 'favicons/android-icon-192x192.png', 'sizes' => '192x192'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-16x16.png', 'sizes' => '16x16'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-32x32.png', 'sizes' => '32x32'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-96x96.png', 'sizes' => '96x96']];
    foreach ($favicons as $favicon) {
        $html .= '<link rel="' . $favicon['rel'] . '"  href="' . $favicon['href'] . '"  sizes="' . $favicon['sizes'] . '" >';
    }
    return $html;
}
