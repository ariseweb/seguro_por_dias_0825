<?php
require_once 'JSONHelper.php';

class Policy extends JSONHelper{
    public $quantity;
    public $temporality;
    public $startDate;
    public $startHour;
    public $green_card;

    public function __construct($quantity = null, $temporality = null, $startDate = null, $startHour = null, $green_card = null) {
        $this->quantity = $quantity;
        $this->temporality = $temporality;
        $this->startDate = $startDate;
        $this->startHour = $startHour;
        $this->green_card = $green_card;
    }
}