<?php

function checkPrime($num)
{
   if ($num == 1)
   return 0;
   for ($i = 2; $i <= $num/2; $i++)
   {
      if ($num % $i == 0)
      return 0;
   }
   return 1;
}

echo "<h2>Prime Numbers between ".$_POST['first']." and ".$_POST['last']."</h2> ";
for($num = $_POST['first']; $num <= $_POST['last']; $num++) {
	$flag = checkPrime($num);
	if ($flag == 1) {
		echo $num." ";
	}	
}  
?>