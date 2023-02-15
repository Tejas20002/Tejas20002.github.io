<?php
$unit = $_POST['unit'];

if ($unit <= 50)
{
	echo "Your Payable Amount is : ".$unit*3.50;
}
else if ($unit > 50 & $unit <= 150)
{
	echo "Your Payable Amount is : ".$unit*4.00;
}
else if ($unit > 150 & $unit <= 250)
{
	echo "Your Payable Amount is : ".$unit*5.20;
}
else if ($unit > 250)
{
	echo "Your Payable Amount is : ".$unit*6.50;
}


?>
<html>
<body>
	<br><a href="ElectricityBill.html">Back</a>
</body>
</html>
