<?php
// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// USEFUL FUNCTIONS
// - 
// - 

function split_in_two($str, $delm) {
    return ['first' => strstr($str,$delm,true),
            'second' => ltrim(strstr($str,$delm),$delm)];
}

?>