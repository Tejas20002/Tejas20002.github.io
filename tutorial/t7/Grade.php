<?php
$maths = $_POST['maths'];        
$python = $_POST['python'];
$java = $_POST['java'];
$os = $_POST['os'];
$wp = $_POST['wp'];


$total = $maths + $python + $java + $os + $wp;
$average = $total / 5.0;
$percentage = ($total / 500.0) * 100;


$sAvg = (int) ($average / 10);

// It will calculate the Grade
switch ($sAvg) {
    case 10:
        $grade = 'A+';
        break;

    case 9:
        $grade = 'A';
        break;

    case 8:
        $grade = 'B';
        break;

    case 7:
        $grade = 'C';
        break;

    case 6:
        $grade = 'D';
        break;

    default:
        $grade = 'E';
        break;
}


echo "The Total marks   = " . $total;
echo "<br>";
echo "The Average marks = " . $average;
echo "<br>";
echo "The Percentage    = " .$percentage . "%";
echo "<br>";
echo "The Grade         = " . $grade;

?>