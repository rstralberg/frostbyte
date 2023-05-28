<?php
// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// GENERATE CSS VARIABLES USING A THEME
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
    $style .= generate_style_part('body', $theme->body);
    $style .= generate_style_part('navbar', $theme->navbar);
    $style .= generate_style_part('navlinks', $theme->navlinks);
    $style .= generate_style_part('footer', $theme->footer);
    $style .= generate_style_part('controls', $theme->controls);
    $style .= generate_style_part('inputs', $theme->inputs);
    $style .= generate_style_part('block', $theme->block);
    $style .= generate_style_part('left', $theme->left);
    $style .= generate_style_part('right', $theme->right);
    $style .= generate_style_part('panelarea', $theme->panelarea);
    $style .= generate_style_part('centerpanel', $theme->centerpanel);
    $style .= generate_style_part('sidepanels', $theme->sidepanels);
    $style .= generate_style_part('toolbar', $theme->toolbar);
    $style .= generate_style_part('tools', $theme->tools);
    $style .= '}';

    // debugging
    // $fh = fopen('root.css','w');
    // fwrite($fh,$style);
    // fclose($fh);

    return '<style>' . $style . '</style>';
}

function generate_style_part($part, $json)
{
    $html = '';
    $obj = json_decode($json);
    $vars = get_object_vars($obj);
    foreach ($vars as $key => $value) {
        if( strstr($value,'@'))  {
            $values = split_in_two($value, '@');
            $html .= '--' . $part . '-' . $key . ':' . $values['first'] . ';' . PHP_EOL;
            $html .= '--' . $part . '-' . $key . '-media:' . $values['second'] . ';' . PHP_EOL;
        }
        else if( strstr($key,':')) {
            $split = split_in_two($key,':');
            $html .= '--' . $part . '-' . $split['second'] . '-' . $split['first'] . ':' . $value . ';' . PHP_EOL;
        }
        else 
            $html .= '--' . $part . '-' . $key . ':' . $value . ';' . PHP_EOL;
    }
    return $html;
}

?>