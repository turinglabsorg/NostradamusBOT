<?php include('scripts/phpmailer.php'); ?>
<?php include('scripts/language_detection.php'); ?>
<?php include('scripts/phpFunctions.php'); ?>
<!doctype html>
<html class="no-js" lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>NostradamusBOT - <?php echo $locales['title']; ?></title>
        <meta name="description" content="Easily manage and set rules for your buys and sells in crypto markets">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSS Dependencies -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
		<link rel="icon" type="image/x-icon" href="/images/favicon.png">
        <link rel="stylesheet" href="/css/shards.min.css">
        <link rel="stylesheet" href="/css/shards-extras.min.css">
    </head>
    <body class="shards-app-promo-page--1">
      <!-- Welcome Section -->
      <div class="welcome d-flex justify-content-center flex-column">
        <div class="container">
          <!-- Navigation -->
          <nav class="navbar navbar-expand-lg navbar-dark pt-4 px-0">
            <a class="navbar-brand mr-5" href="#">
              <img src="/images/logo_top.png" class="mr-2" alt="NostradamusBOT" height="55">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="#app-features"><?php echo $locales['features']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#pricing"><?php echo $locales['pricing']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#contact"><?php echo $locales['contacts']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://app.nostradamusbot.com"><?php echo $locales['webapp']; ?></a>
                </li>
              </ul>

              <!-- Social Icons -->
              <ul class="header-social-icons navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link" href="https://twitter.com/futuringcompany" target="_blank"><i class="fa fa-twitter"></i></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://www.facebook.com/futuringcompany" target="_blank"><i class="fa fa-facebook"></i></a>
                </li>
              </ul>
            </div>
          </nav>
          <!-- / Navigation -->
        </div> <!-- .container -->

        <!-- Inner Wrapper -->
        <div class="inner-wrapper mt-auto mb-auto container">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-12 mt-auto mb-auto mr-3">
                <h1 class="welcome-heading display-4 text-white"><?php echo $locales['home_title']; ?></h1>
                <p class="text-muted"><?php echo $locales['home_claim']; ?></p>
                <a href="https://app.nostradamusbot.com" class="btn btn-lg btn-success btn-pill align-self-center"><?php echo $locales['entra_subito']; ?></a>
                <br><br>
                <p class="text-muted"><?php echo $locales['subscribe_coinbase']; ?></p>
				<!--
                <div class="d-block mt-4">
                  <a href="https://designrevision.com/download/shards"><img class="w-25 mt-2 mr-3" src="images/app-promo/badge-apple-store.png" alt="Get it on Apple Store"></a>
                  <a href="https://designrevision.com/download/shards"><img class="w-25 mt-2" src="images/app-promo/badge-google-play-store.png" alt="Get it on Google Play Store"></a>
                </div>-->
            </div>

            <!--<div class="col-lg-4 col-md-5 col-sm-12 ml-auto">
              <img class="iphone-mockup ml-auto" src="images/app-promo/iphone-app-mockup.png">
            </div>-->
          </div>
        </div>
        <!-- / Inner Wrapper -->
      </div>
      <!-- / Welcome Section -->

      <!-- Features Section -->
      <div id="app-features" class="app-features section">
        <div class="container-fluid">
          <div class="row">
            <div class="app-screenshot col-lg-4 col-md-12 col-sm-12 px-0 py-5">
              <!--<img class="mt-auto mb-auto" src="images/app-promo/iphone-app-screenshot.png" alt="App Screenshot - Shards App Promo Demo Page">-->
            </div>

            <!-- App Features Wrapper -->
            <div class="app-features-wrapper col-lg-4 col-md-6 col-sm-12 py-5 mx-auto">
              <div class="container">
                <h3 class="section-title underline--left my-5"><?php echo $locales['features']; ?></h3>
                <div class="feature py-4 d-flex">
                  <div class="icon text-white bg-success mr-5"><i class="fa fa-refresh"></i></div>
                  <div>
                      <h5><?php echo $locales['imposta_regole_titolo']; ?></h5>
                      <p><?php echo $locales['imposta_regole_testo']; ?></p>
                  </div>
                </div>

                <div class="feature py-4 d-flex">
                  <div class="icon text-white bg-success mr-5"><i class="fa fa-share"></i></div>
                  <div>
                      <h5><?php echo $locales['aspetta_esito_titolo']; ?></h5>
                      <p><?php echo $locales['aspetta_esito_testo']; ?></p>
                  </div>
                </div>
                
                <div class="feature py-4 d-flex">
                  <div class="icon text-white bg-success mr-5"><i class="fa fa-shield"></i></div>
                  <div>
                      <h5><?php echo $locales['test_titolo']; ?></h5>
                      <p><?php echo $locales['test_testo']; ?></p>
                  </div>
                </div>


                <div class="feature py-4 d-flex">
                  <div class="icon text-white bg-success mr-5"><i class="fa fa-euro"></i></div>
                  <div>
                      <h5><?php echo $locales['commissioni_titolo']; ?></h5>
                      <p><?php echo $locales['commissioni_testo']; ?></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- / Features Section -->

      <!-- Testimonials Section -->
      <div class="testimonials section py-4">
          <h3 class="section-title text-center m-5"><?php echo $locales['pricing']; ?></h3>

          <div class="container py-5">
            <div class="row">
                <div class="col-md-12 testimonial text-center">
                    <h5 class="mb-1"><?php echo $locales['prezzo_fisso']; ?></h5>
                    <p><?php echo $locales['pagamento_mensile']; ?></p>
                </div>
            </div>
          </div>
      </div>
      <!-- / Testimonials Section -->

      <!-- Contact Section -->
      <div class="contact section-invert py-4" id="contact">
        <h3 class="section-title text-center m-5"><?php echo $locales['contattaci']; ?></h3>
        <div class="container py-4">
          <div class="row justify-content-md-center px-4">
            <div class="contact-form col-sm-12 col-md-10 col-lg-7 p-4 mb-4 card">
              <form method="POST">
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="contactFormFullName"><?php echo $locales['nome']; ?></label>
                      <input type="text" class="form-control" required placeholder="<?php echo $locales['nome']; ?>" name="nome" id="contactFormFullName">
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="contactFormEmail"><?php echo $locales['indirizzo_email']; ?></label>
                      <input type="email" class="form-control" required placeholder="<?php echo $locales['indirizzo_email']; ?>" id="contactFormEmail" name="email">
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                        <label for="exampleInputEmail1"><?php echo $locales['messaggio']; ?></label>
                        <textarea id="exampleInputEmail1" required class="form-control mb-4" placeholder="<?php echo $locales['messaggio']; ?>" rows="10" name="message"></textarea>
                    </div>
                  </div>
                </div>
                <input type="hidden" name="sendMail" value="Y">
                <input class="btn btn-success btn-pill d-flex ml-auto mr-auto" type="submit" value="<?php echo $locales['invia_messaggio']; ?>">
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- / Contact Section -->

      <!-- Footer Section -->
      <footer>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a class="navbar-brand" href="https://futuring.co" target="_blank">NostradamusBOT <?php echo $locales['progetto_di']; ?> Futuring</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                  <a class="nav-link" href="#app-features"><?php echo $locales['features']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#pricing"><?php echo $locales['pricing']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#contact"><?php echo $locales['contacts']; ?></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://app.nostradamusbot.com"><?php echo $locales['webapp']; ?></a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </footer>
      <!-- / Footer Section -->

      <!-- JavaScript Dependencies -->
      <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
	  <!-- Global site tag (gtag.js) - Google Analytics -->
	  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111332175-1"></script>
	  <script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());
		
		  gtag('config', 'UA-111332175-1');
      </script>
    </body>
</html>
