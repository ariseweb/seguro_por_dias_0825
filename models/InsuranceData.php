<?php

require_once 'Quotation.php';

class InsuranceData extends Quotation{
    public $quotationId;
    public $partner;
    public $redirects;

    public function __construct($quotationId = null, $vehicle = null, $policyHolder = null, $policy = null, $partner = null,$redirects = null, $products = []) {        
        parent::__construct($quotationId, $vehicle, $policyHolder,$policy,$products );
        $this->quotationId = $quotationId;
        $this->partner = $partner;
        $this->redirects = $redirects;
    }
}