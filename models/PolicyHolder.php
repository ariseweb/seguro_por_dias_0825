<?php

require_once 'JSONHelper.php';

class PolicyHolder extends JSONHelper{
    public $name;
    public $lastname;
    public $lastname2;
    public $birthdate;
    public $licenseDate;
    public $nationalCardIdType;
    public $nationalCardId;
    public $postalCode;
    public $city;
    public $streetType;
    public $streetName;
    public $streetNumber;
    public $streetMore;
    public $phone;
    public $email;
    public $gender;
    public $isCompany;
    public $companyName;
    public $cif;

    public function __construct($name = null, $lastname = null, $lastname2 = null, $birthdate = null, $licenseDate = null, $nationalCardIdType = null, $nationalCardId = null, $postalCode = null, $city = null, $streetType = null, $streetName = null, $streetNumber = null, $streetMore = null, $phone = null, $email = null, $gender = null, $isCompany = null, $companyName = null, $cif = null) {
        $this->name = $name;
        $this->lastname = $lastname;
        $this->lastname2 = $lastname2;
        $this->birthdate = $birthdate;
        $this->licenseDate = $licenseDate;
        $this->nationalCardIdType = $nationalCardIdType;
        $this->nationalCardId = $nationalCardId;
        $this->postalCode = $postalCode;
        $this->city = $city;
        $this->streetType = $streetType;
        $this->streetName = $streetName;
        $this->streetNumber = $streetNumber;
        $this->streetMore = $streetMore;
        $this->phone = $phone;
        $this->email = $email;
        $this->gender = $gender;
        $this->isCompany = $isCompany;
        $this->companyName = $companyName;
        $this->cif = $cif;
    }
}
