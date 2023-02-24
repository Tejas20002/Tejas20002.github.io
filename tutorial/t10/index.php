<?php
include 'connection.php';
if($_POST['register']){
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $sql = "INSERT INTO `users`(`fname`, `lname`, `email`, `password`) VALUES ('$fname','$lname','$email','$password')";
    $query = mysqli_query($con, $sql);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login and Registration form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="t6/style.css">
</head>

<body>
    <?php
     if($query){
        echo '
        <div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>Register</strong> Done.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        ';
    }
    ?>
    <div class="form">
        
        <ul class="tab-group">
            <li class="tab active"><a href="#signup">Sign Up</a></li>
            <li class="tab"><a href="#login">Log In</a></li>
        </ul>
        
        <div class="tab-content">
            <div id="signup">
               
                <form action="" id="registerForms" method="post">
                    
                    <div class="top-row">
                        <div class="field-wrap form-group">
                            <label>
                                First Name<span class="req">*</span>
                            </label>
                            <input type="text" name="fname" id="fname"/>
                        </div>
                        
                        <div class="field-wrap form-group">
                            <label>
                                Last Name<span class="req">*</span>
                            </label>
                            <input type="text" name="lname" id="lname"/>
                        </div>
                    </div>

                    <div class="field-wrap form-group">
                        <label>
                            Email Address<span class="req">*</span>
                        </label>
                        <input type="email" name="email" id="email"/>
                    </div>
                    
                    <div class="field-wrap form-group">
                        <label>
                            Set A Password<span class="req">*</span>
                        </label>
                        <input type="password" name="password" id="password"/>
                    </div>
                    
                    <input type="submit" name="register" class="button button-block" value="Get Started" />
                    
                </form>
                
            </div>
            
            <div id="login">
                <form action="/" id=loginForm method="post">
                    <div class="form-group field-wrap">
                        <label>
                            Email Address<span class="req">*</span>
                        </label>
                        <input type="email" name="email" id="email"/>
                    </div>
                    <div class="form-group field-wrap">
                        <label>
                            Password<span class="req">*</span>
                        </label>
                        <input type="password" name="password" id="password" />
                    </div>
                    <p class="forgot"><a href="#">Forgot Password?</a></p>
                    <input type="submit" class="button button-block" value="Log In" />
                </form>
            </div>
        </div><!-- tab-content -->
    </div> <!-- /form -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://adminlte.io/themes/v3/plugins/jquery-validation/jquery.validate.min.js"></script>
    <script src="https://adminlte.io/themes/v3/plugins/jquery-validation/additional-methods.min.js"></script>
    <script src="t6/main.js"></script>
</body>

</html>