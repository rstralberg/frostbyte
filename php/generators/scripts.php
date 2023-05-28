<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Scan Scriptfiles 
// - Scans script files and generate script include for header

function generate_scripts() {

    $scriptfolders = [
        'js',
        'js/utils',
        'js/db',
        'js/form',
        'js/ui',
        'js/ui/editors',
        'js/ui/forms',
        'js/page',
        'js/page/blocks',
        'js/panels'
    ];

    $html = '';
    foreach($scriptfolders as $folder ) {
        $scripts = glob('../public/' . $folder . '/*.js');
        foreach ($scripts as $script) {
            $html .= '<script type="application/javascript" src="'.$folder.'/' . basename($script) . '"></script>';
        }
    }
    return $html;
}

?>