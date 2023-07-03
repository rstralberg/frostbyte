<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Generate Css Variables Using A Theme
// - 
// - 
require_once  __DIR__ . '/../utils.php';

function generate_style($db, $name)
{
    $style = ':root {';
    $theme = read_theme($db, '`name`=' . db::string($name), null, dbmode::single);
    if ($theme == null) {
        throw new Exception('Unable to load theme ' . $name);
    }

    $style .= '--theme_name:' . db::string($theme->name) . ';';
    $style .= '--bg1:' . $theme->bg1 . ';';
    $style .= '--fg1:' . $theme->fg1 . ';';
    $style .= '--bg2:' . $theme->bg2 . ';';
    $style .= '--fg2:' . $theme->fg2 . ';';
    $style .= '--bg3:' . $theme->bg3 . ';';
    $style .= '--fg3:' . $theme->fg3 . ';';
    $style .= '--font:"' . $theme->font . '";';
    $style .= '--fsize:' . $theme->fsize . ';';
    $style .= '--links:' . $theme->links . ';';
    $style .= '--bg4:' . $theme->bg4 . ';';
    $style .= '--fg4:' . $theme->fg4 . ';';
    $style .= '--bg4h:' . $theme->bg4h . ';';
    $style .= '--fg4h:' . $theme->fg4h . ';';
    $style .= '--bg4l:' . $theme->bg4l . ';';
    $style .= '--fg4l:' . $theme->fg4l . ';';
    $style .= '--bg5:' . $theme->bg5 . ';';
    $style .= '--fg5:' . $theme->fg5 . ';';
    $style .= '--bg5s:' . $theme->bg5s . ';';
    $style .= '--fg5s:' . $theme->fg5s . ';';
    $style .= '--nav_fsize:' . $theme->nav_fsize . ';';
    $style .= '--nav_fweight:' . $theme->nav_fweight . ';';
    $style .= '--nav_border:' . $theme->nav_border . ';';
    $style .= '--footer_border:' . $theme->footer_border . ';';
    $style .= '--main_border:' . $theme->main_border . ';';
    $style .= '--nav_radius:' . $theme->nav_radius . ';';
    $style .= '--footer_radius:' . $theme->footer_radius . ';';
    $style .= '--main_radius:' . $theme->main_radius . ';';
    $style .= '--shadow_size:' . $theme->shadow_size . ';';
    $style .= '--nav_shadow:' . $theme->nav_shadow . ';';
    $style .= '--footer_shadow:' . $theme->footer_shadow . ';';
    $style .= '--main_shadow:' . $theme->main_shadow . ';';
    $style .= '--footer_fsize:' . $theme->footer_fsize . ';';
    $style .= '--footer_fstyle:' . $theme->footer_fstyle . ';';
    $style .= '--title_fg:' . $theme->title_fg . ';';
    $style .= '}';

    // debugging
    // $fh = fopen('root.css','w');
    // fwrite($fh,$style);
    // fclose($fh);

    return '<style>' . $style . '</style>';
}

function scanCss()
{
    $cssfiles = glob('../public/css/*.css');
    $css = '';
    foreach ($cssfiles as $font) {
        $parts = pathinfo($font);
        $css .= '<link rel="stylesheet" type="text/css" href="css/' . $parts['basename'] . '">' . PHP_EOL;
    }

    return $css;
}

?>
