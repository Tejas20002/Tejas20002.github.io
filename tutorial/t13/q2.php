<?php

class Student {
    public $name;
    public $grades;

    public function getAverageGrade() {
        return array_sum($this->grades) / count($this->grades);
    }
}

// Create array of three Student objects
$students = [
    new Student(),
    new Student(),
    new Student()
];

// Set name and grades for each student
$students[0]->name = 'A';
$students[0]->grades = [80, 85, 90];

$students[1]->name = 'B';
$students[1]->grades = [75, 70, 80];

$students[2]->name = 'C';
$students[2]->grades = [90, 95, 85];

// Call getAverageGrade method for each student and print result
foreach ($students as $student) {
    echo $student->name . '\'s average grade is: ' . $student->getAverageGrade() . '<br>';
}
?>
