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
        'js/utils/form',
        'js/components',
        'js/components/theme',
        'js/contents',
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