<?php
$con = mysqli_connect('localhost', 'popeye', 'apstndp@20', 'pizza') or die();
// $con = mysqli_connect('fdb29.awardspace.net', '3670910_test', 'apstndp@20', '3670910_test') or die();
$query_user = mysqli_query($con, "SELECT * FROM `image`");
$query=null;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $statusMsg = '';
    $fileName = basename($_FILES["file"]["name"]);
    $targetFilePath = "uploads/".$fileName;
    $fileType = pathinfo($fileName);

    if(isset($_POST["submit"]) && !empty($_FILES["file"]["name"])) {
        if(move_uploaded_file($_FILES['file']['tmp_name'], "uploads/".$fileName)){
            $email = $_POST['email'];
            $password = $_POST['password'];
            $sql = "INSERT INTO `image`(`email`, `password`, `image`) VALUES ('$email','$password','$fileName')";
            $query = mysqli_query($con, $sql);
            if(isset($_POST['remember'])){
                setcookie("email",$email,time()+60*60);			
                setcookie("passowrd",$password,time()+60*60);	
            }
        }else{
            $statusMsg = "Sorry, there was an error uploading your file.";
        }
    }else{
        $statusMsg = 'Please select a file to upload.';
    }
}
?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tutorial 12</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
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
    <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
                type="button" role="tab" aria-controls="nav-home" aria-selected="true">Login</button>
            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Image</button>
        </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"
            tabindex="0">
            <div class="container-fluid mx-5">
                <form method="post" action="" enctype="multipart/form-data">
                    <div class="mb-3">
                        <center>
                            <h2 style="color: red;"><?php echo $statusMsg; ?></h2>
                        </center>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" name="email" id="exampleInputEmail1"
                            aria-describedby="emailHelp" required>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" name="password" id="exampleInputPassword1" required>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputFile" class="form-label">File Upload (Image)</label>
                        <input type="file" name="file" class="form-control" id="exampleInputFile" required>
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" name="remember" id="exampleCheck1" required>
                        <label class="form-check-label" for="exampleCheck1">Remember me</label>
                    </div>

                    <input type="submit" name="submit" class="btn btn-primary" value="Submit">
                </form>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                        <th scope="col">Image</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    while ($row = mysqli_fetch_array($query_user)) { ?>
                    <tr>
                        <th scope="row"><?php echo $row['id']; ?></th>
                        <td><?php echo $row['email']; ?></td>
                        <td><?php echo $row['password']; ?></td>
                        <td><img scr="uploads/<?php echo $row['image']; ?>" width="100" height="100" /></td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous">
    </script>
</body>

</html>