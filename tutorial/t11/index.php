<hr>Q1 Write PHP Script using two dimensional arrays such as addition of two 2x2 matrices.  <hr>

output:-<br>

<?php 


$a1=array(array(6,2),array(11,3));
$a2=array(array(5,3),array(4,3));
for($i=0; $i<=1; $i++) 
{
    for($j=0; $j<=1; $j++) 
    {
	$result[$i][$j] = $a1[$i][$j] + $a2[$i][$j];
    }
}
echo "Addtion of 2d Matrices is:<br>";
//for print output 
for($i=0; $i<=1; $i++) 
{
    for($j=0; $j<=1; $j++) 
    {
	echo $result[$i][$j];
	echo "\t";
    }
    echo "<br/>";
}
/* another way to print array
echo "Addtion of 2d array is: ";print_r($result);
*/
?>


<hr>Q2 Write PHP Script to demonstrate use of associative arrays and for FOR EACH loop execution. <hr>

output:-<br>

<?php 
$freelancer = array( 
    "name" => "Tejas", 
    "email" => "tejashirani55@gmail.com", 
    "age" => 20, 
    "gender" => "male"
); 
  
 
foreach($freelancer as $key => $value) { 
    echo $key . ": " . $value . "<br>"; 
} 
?> 


<hr>Q3 <hr>


<!DOCTYPE html>
<html>
<head>
   <title></title>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   </head>
   <body>
   <form action="tutorial11-show.php" name="myForm" onsubmit="return validateForm(this);" method='POST'>
   	<div id="msg"> </div>
   <h2>Please input your name:</h2>
 <input type="text" name="name" required>
  Hobbies<br>
  <input type="checkbox" name="hobby[]" value="Cricket">Cricket<br>
  <input type="checkbox" name="hobby[]" value="Football">Football<br>
  <input type="checkbox" name="hobby[ ]" value="Dancing">Dancing<br>
    <input type="checkbox" name="hobby[ ]" value="Badminton">Badminton<br>
      <input type="checkbox" name="hobby[ ]" value="Basketball">Basketball<br>
<hr>
<input type="submit" value="Submit Name">
 </form>

<script type="text/javascript">
	function validateForm(form) {

        var hobbyGroup =  document.getElementsByName("hobby[]");
        var checkedhobby = 0
        
        for (var i = 0; i < hobbyGroup.length; i++) {
            if (hobbyGroup[i].checked) {
                checkedhobby++;
            }
        }
        if (checkedhobby == 0) {
            document.getElementById("msg").innerHTML = "Hobby is required field!";
            return false;
        }
        return true	;
    }
</script>
</body>
</html>
