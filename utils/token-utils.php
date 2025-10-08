<?php

$path = __DIR__ . '/..';
require_once $path . "/services/login-service.php";

function SDNW_getNoExpToken()
{
  $current = current_time('timestamp');
  if (get_transient('SDNWtokenExp')) {
    $tokenexp = get_transient('SDNWtokenExp');
    if ($current > $tokenexp) {
      SDNW_wp_getDatafromLogin();
    }
  } else {
    SDNW_wp_getDatafromLogin();
  }
  if (get_transient('SDNWtoken')) {
    return get_transient('SDNWtoken');
  } else {
    return null;
  }
}