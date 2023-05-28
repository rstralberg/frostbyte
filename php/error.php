<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Error Handling
// - Asserts
// - Errors
// - Exceptions

// ASSERTS
assert_options(ASSERT_ACTIVE, 1);
assert_options(ASSERT_WARNING, 0);

function assert_hander($file, $line, $code, $desc = null)
{
    echo 'Assert in ' . $file . ' at line ' . $line .': ' . $code . hex2bin('0d0a');
    if ($desc) {
        echo ": $desc" . hex2bin('0d0a');
    }
    echo hex2bin('0d0a');
}
assert_options(ASSERT_CALLBACK, 'assert_handler');


// ERRORS
set_error_handler('appErrorHandler');
function appErrorHandler($errno, $errstr, $errfile, $errline)
{
    echo ('ERROR [' . $errno . ']: ' . $errstr . '<br>' . hex2bin('0d0a'));
    echo ('FILE ' . $errfile . ' ' . ' at line ' . $errline . '<br>' . hex2bin('0d0a'));
}

// EXECPTIONS
set_exception_handler("appExceptionHandler");
function appExceptionHandler($exception)
{
    echo 'Exception ' . $exception->getMessage() . '<br>' . $exception->getFile() . '<br>' . hex2bin('0d0a');
}

