<?php

class Redirects{
    public $urlok;
    public $urlko;

    public function __construct($urlok = null, $urlko = null) {
        $this->urlok = $urlok;
        $this->urlko = $urlko;
    }
}