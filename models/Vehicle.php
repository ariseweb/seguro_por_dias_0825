<?php

require_once 'JSONHelper.php';

class Vehicle extends JSONHelper{
    public $riskType;
    public $riskSubtype;
    public $make;
    public $model;
    public $plate;
    public $country;
    public $isOwner;
    public $ownerName;
    public $ownerLastname;
    public $ownerNationalCardIdType;
    public $ownerNationalCardId;

    public function __construct($riskType = null, $riskSubtype = null, $make = null, $model = null, $plate = null, $country = null, $isOwner = null, $ownerName = null, $ownerLastname = null, $ownerNationalCardIdType = null, $ownerNationalCardId = null) {
        $this->riskType = $riskType;
        $this->riskSubtype = $riskSubtype;
        $this->make = $make;
        $this->model = $model;
        $this->plate = $plate;
        $this->country = $country;
        $this->isOwner = $isOwner;
        $this->ownerName = $ownerName;
        $this->ownerLastname = $ownerLastname;
        $this->ownerNationalCardIdType = $ownerNationalCardIdType;
        $this->ownerNationalCardId = $ownerNationalCardId;
    }

}