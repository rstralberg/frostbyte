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
    $style .= '--background:' . $theme->background . ';';
    $style .= '--color:' . $theme->color . ';';
    $style .= '--bars_background:' . $theme->bars_background . ';';
    $style .= '--bars_color:' . $theme->bars_color . ';';
    $style .= '--intense_background:' . $theme->intense_background . ';';
    $style .= '--intense_color:' . $theme->intense_color . ';';
    $style .= '--font:"' . $theme->font . '";';
    $style .= '--fsize:' . $theme->fsize . ';';
    $style .= '--links:' . $theme->links . ';';
    $style .= '--titles_background:' . $theme->titles_background . ';';
    $style .= '--titles_color:' . $theme->titles_color . ';';
    $style .= '--ctl_background_hover:' . $theme->ctl_background_hover . ';';
    $style .= '--ctl_color_hover:' . $theme->ctl_color_hover . ';';
    $style .= '--ctl_background_active:' . $theme->ctl_background_active . ';';
    $style .= '--ctl_color_active:' . $theme->ctl_color_active . ';';
    $style .= '--section_background:' . $theme->section_background . ';';
    $style .= '--section_color:' . $theme->section_color . ';';
    $style .= '--section_selected_background:' . $theme->section_selected_background . ';';
    $style .= '--section_selected_color:' . $theme->section_selected_color . ';';
    $style .= '--button_background:' . $theme->button_background . ';';
    $style .= '--button_color:' . $theme->button_color . ';';
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
    $style .= '--more_shadow:' . $theme->more_shadow . ';';
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
