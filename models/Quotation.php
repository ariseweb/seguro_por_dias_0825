<?php
require_once 'JSONHelper.php';

class Quotation extends JSONHelper {
    public $quotationId;
    public $vehicle;
    public $policyHolder;
    public $policy;
    public $products;

    public function __construct($quotationId  = null,$vehicle = null, $policyHolder = null, $policy = null, $partner = null, $products = []) {
        $this->quotationId = $quotationId;
        $this->vehicle = $vehicle;
        $this->policyHolder = $policyHolder;
        $this->policy = $policy;
        $this->products = $products;
    }
}