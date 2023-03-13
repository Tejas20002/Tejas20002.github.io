<?php

class BankAccount {
    public $balance;
    public $interestRate;

    public function deposit($amount) {
        $this->balance += $amount;
    }

    public function withdraw($amount) {
        $this->balance -= $amount;
    }

    public function addInterest() {
        $this->balance *= (1 + $this->interestRate);
    }
}

// Create BankAccount object
$account = new BankAccount();

// Set balance and interestRate properties
$account->balance = 1000;
$account->interestRate = 0.05;

// Call deposit method with an amount
$account->deposit(500);

// Call withdraw method with another amount
$account->withdraw(200);

// Call addInterest method
$account->addInterest();

// Print balance property
echo 'Current balance: $' . $account->balance;
?>