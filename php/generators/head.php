<?php

// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Generate Header
// - Generates a comple HTML header
// - Scans CSS and JS files to include in header
//

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db/config.php';
require_once __DIR__ . '/../db/theme.php';
require_once __DIR__ . '/favicons.php';
require_once __DIR__ . '/scripts.php';
require_once __DIR__ . '/style.php';

function generate_head($db, $config)
{
    $html = '<head>' 
    . '<title>' . $config->sitename . '</title>'
    . '<meta charset="'. CONF_CHARSET .'">'
    . '<meta name="viewport" content="width=device-width,initial-scale=1.0">'
    . '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
    $html .= generate_favicons($config);
    $html .= generate_style($db, $config->theme);
    $html .= generate_scripts();    
    $html .= scanCss();

    $html .= '</head>';
    return $html;
}
