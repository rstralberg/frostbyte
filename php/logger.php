<?php

const logfile = __DIR__ . '/../public/frostbyte.log';

function logger_on()
{
    if( isset($GLOBALS['debug']) && $GLOBALS['debug'] === 'true') {
        $GLOBALS['logger'] = fopen(logfile, 'a');
    }
}

function logger_off()
{
    if (isset($GLOBALS['logger'])) {
        $fh = $GLOBALS['logger'];
        if ($fh) {
            fflush($fh);
            fclose($fh);
        }
        $GLOBALS['logger'] = null;
    }
}
function logger($str)
{
    if (isset($GLOBALS['logger'])) {
        $fh = $GLOBALS['logger'];
        if ($fh) {
            $str = print_r(date("H:i:s") . ' ' . $str . PHP_EOL, true);
            fwrite($fh, $str);
            fflush($fh);
            return true;
        }
    }
    return false;
}

function clear_logger()
{
    if (file_exists(logfile)) {
        unlink(logfile);
    }
}

function dump($str)
{
    print_r($str . PHP_EOL);

    logger_on();
    logger($str);
    logger_off();
}
