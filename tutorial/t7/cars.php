<?php      
    $car = "Hyundai";                   
        $model = "Tucson";    
        switch( $car )    
        {    
            case "Honda":    
                switch( $model )     
                {    
                    case "Amaze":    
                           echo "Honda Amaze price is 5.93 - 9.79 Lakh.";   
                        break;    
                    case "City":    
                           echo "Honda City price is 9.91 - 14.31 Lakh.";    
                        break;     
                }    
                break;    
            case "Renault":    
                switch( $model )     
                {    
                    case "Duster":    
                        echo "Renault Duster price is 9.15 - 14.83 L.";  
                        break;    
                    case "Kwid":    
                           echo "Renault Kwid price is 3.15 - 5.44 L.";  
                        break;    
                }    
                break;    
            case "Hyundai":    
                switch( $model )     
                {    
                    case "Creta":    
                        echo "Hyundai Creta price is 11.42 - 18.73 L.";  
                        break;    
        case "Tucson":    
                           echo "Hyundai Tucson price is 22.39 - 32.07 L.";  
                        break;   
                    case "Xcent":    
                           echo "Hyundai Xcent price is 6.5 - 10.05 L.";  
                        break;    
                }    
                break;     
        }  
?>