angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('resources/templates/404.html',
    "<div class=\"md-padding\">\n" +
    "\t<h2 class=\"md-headline\">Niet gevonden</h2>\n" +
    "\t<p>Deze pagina kan niet worden gevonden</p>\n" +
    "\t<p>Je kan <a href=\"#/\">hier</a> weer terug naar home</p>\n" +
    "</div>"
  );


  $templateCache.put('resources/templates/account.html',
    "<div class=\"md-padding\">\n" +
    "\t<h3 class=\"md-headline\">Mijn account</h3>\n" +
    "</div>\n" +
    "<md-divider></md-divider>\n" +
    "<fb-data bind-to=\"user\" type=\"object\" path=\"users/{{account.uid}}\"></fb-data>\n" +
    "<pi-accordeon open=\"Persoonlijk\">\n" +
    "\t<pi-accordeon-item active=\"true\" label=\"Persoonlijk\">\n" +
    "\t\t<md-input-container>\n" +
    "\t\t\t<label>Voornaam</label>\n" +
    "\t\t\t<input required ng-model=\"user.voornaam\" />\n" +
    "\t\t</md-input-container>\n" +
    "\t\t<md-input-container>\n" +
    "\t\t\t<label>Achternaam</label>\n" +
    "\t\t\t<input required ng-model=\"user.achternaam\" />\n" +
    "\t\t</md-input-container>\n" +
    "\t</pi-accordeon-item>\n" +
    "\t<pi-accordeon-item label=\"Thema\">\n" +
    "\t\t<div ng-controller=\"piThemeController\">\n" +
    "\t\t\t<p class=\"md-body-2\">Kies twee kleuren om het thema van de app in te stellen</p>\n" +
    "\t\t\t<div class=\"md-padding\">\n" +
    "\t\t\t\t<pi-material-palette pp=\"theme.pp\" ap=\"theme.ap\"></pi-material-palette>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<md-divider></md-divider>\n" +
    "\t\t\t<div class=\"md-padding\" layout=\"row\" layout-align=\"start center\">\n" +
    "\t\t\t\t<span>\n" +
    "\t\t\t\t\t<small><strong>Primair</strong></small>\n" +
    "\t\t\t\t\t<pi-material-palette-item palette=\"{{theme.pp}}\"></pi-material-palette-item>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t\t<span>\n" +
    "\t\t\t\t\t<small><strong>Secundair</strong></small>\n" +
    "\t\t\t\t\t<pi-material-palette-item palette=\"{{theme.ap}}\"></pi-material-palette-item>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t\t<md-button class=\"md-raised\" ng-click=\"changeTheme()\">Opslaan</md-button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</pi-accordeon-item>\n" +
    "\t<pi-accordeon-item label=\"Wachtwoord wijzigen\">\n" +
    "\t\t<div ng-controller=\"AppFirebaseAccountController\">\n" +
    "\t\t\t<form name=\"AppFirebaseChangePasswordForm\" ng-if=\"canChangePassword\" ng-submit=\"changePassword(AppFirebaseChangePasswordForm)\">\n" +
    "\t\t\t\t<md-input-container>\n" +
    "\t\t\t\t\t<label>Vorige wachtwoord</label>\n" +
    "\t\t\t\t\t<input type=\"password\" required ng-model=\"nieuwwachtwoord.huidigWachtwoord\" />\n" +
    "\t\t\t\t</md-input-container>\n" +
    "\t\t\t\t<md-input-container>\n" +
    "\t\t\t\t\t<label>Nieuw wachtwoord</label>\n" +
    "\t\t\t\t\t<input type=\"password\" required ng-model=\"nieuwwachtwoord.wachtwoord\" />\n" +
    "\t\t\t\t</md-input-container>\n" +
    "\t\t\t\t<md-input-container>\n" +
    "\t\t\t\t\t<label>Bevestig nieuw wachtwoord</label>\n" +
    "\t\t\t\t\t<input type=\"password\" pi-compare-to=\"nieuwwachtwoord.wachtwoord\" required ng-model=\"nieuwwachtwoord.bevestiging\" />\n" +
    "\t\t\t\t</md-input-container>\n" +
    "\t\t\t\t<div layout=\"row\" layout-align=\"end center\">\n" +
    "\t\t\t\t\t<md-button ng-disabled=\"AppFirebaseChangePasswordForm.$invalid\" class=\"md-primary md-raised\">wijzig</md-button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t\t<p ng-if=\"!canChangePassword\" class=\"md-body-2\">You can not change your password if you are logged in with {{account.provider}}</p> \n" +
    "\t\t</div>\n" +
    "\t</pi-accordeon-item>\n" +
    "</pi-accordeon>"
  );


  $templateCache.put('resources/templates/home.html',
    "<div class=\"md-padding\">\n" +
    "\t<h3 class=\"md-headline\">Kies een les</h3>\n" +
    "</div>\n" +
    "<md-divider ng-controller=\"LesController\">\n" +
    "\t<md-button ng-if=\"hasPermission('les','create')\" class=\"md-fab md-primary md-mini\" ng-click=\"addLes()\">\n" +
    "\t\t<md-icon>add</md-icon>\n" +
    "\t</md-button>\n" +
    "</md-divider>\n" +
    "<fb-data type=\"array\" name=\"lessen\" path=\"les\"></fb-data>\n" +
    "<md-list>\n" +
    "\t<md-list-item ng-click=\"navigateTo('les/' + les.$id)\" ng-repeat=\"les in lessen | orderBy:'naam'\" class=\"md-2-line\">\n" +
    "  \t\t<md-icon>chrome_reader_mode</md-icon>\n" +
    "        <div class=\"md-list-item-text\">\n" +
    "\t\t\t<h3>{{les.naam}}</h3>\n" +
    "\t\t\t<p>{{les.beschrijving}}</p>\n" +
    "        </div>\n" +
    "\t</md-list-item>\n" +
    "</md-list>\n" +
    "<p class=\"md-padding\" ng-if=\"!lessen.length\">\n" +
    "\tEr zijn geen lessen beschikbaar\n" +
    "</p>"
  );


  $templateCache.put('resources/templates/les.html',
    "<md-subheader class=\"md-primary\">\n" +
    "\t{{les.naam}}\n" +
    "</md-subheader>\n" +
    "<fb-data type=\"object\" name=\"les\" path=\"les/{{currentRoute.params.les}}\"></fb-data>\n" +
    "<md-divider ng-controller=\"LesController\">\n" +
    "\t<md-button ng-if=\"hasPermission('opdracht','create')\" class=\"md-fab md-primary md-mini\" ng-click=\"addOpdracht(currentRoute.params.les)\">\n" +
    "\t\t<md-icon>add</md-icon>\n" +
    "\t</md-button>\n" +
    "</md-divider>\n" +
    "<fb-data type=\"array\" name=\"lesopdrachten\" path=\"lesopdracht/{{currentRoute.params.les}}\"></fb-data>\n" +
    "<md-list>\n" +
    "\t<md-list-item ng-class=\"{done: opdracht.done}\" ng-repeat=\"opdracht in lesopdrachten | orderBy:'titel'\" class=\"md-2-line\" ng-click=\"navigateTo('/les/'+currentRoute.params.les+'/opdracht/'+opdracht.$id)\">\t\n" +
    "  \t\t<md-icon ng-if=\"opdracht.type == 'vraag'\">question_answer</md-icon>   \n" +
    "  \t\t<md-icon ng-if=\"opdracht.type == 'meerkeuze'\">check_box</md-icon>  \n" +
    "  \t\t<md-icon ng-if=\"opdracht.type == 'groepsgesprek'\">people</md-icon>     \n" +
    "  \t\t<div class=\"md-list-item-text\">\n" +
    "\t        <h3>{{opdracht.titel}}</h3>\n" +
    "\t\t\t<p>\n" +
    "\t\t\t\t{{opdracht.vraag | limitTo: 60}} ...<br/>\n" +
    "\t\t\t\t<small ng-if=\"opdracht.type == 'groepsgesprek'\">\n" +
    "\t\t\t\t\t{{opdracht.reacties.length || 0}} reactie(s)\n" +
    "\t\t\t\t</small>  \n" +
    "\t\t\t</p>\n" +
    "\t\t</div>\n" +
    "\t</md-list-item>\n" +
    "</md-list>\n" +
    "<p class=\"md-padding\" ng-if=\"!lesopdrachten.length\">\n" +
    "\tEr zijn geen opdrachten voor deze les\n" +
    "</p>"
  );


  $templateCache.put('resources/templates/login.html',
    "<div layout=\"row\" layout-align=\"center center\">\n" +
    "\t<div class=\"md-padding\">\t\n" +
    "\t\t<h2 class=\"md-headline\">Inloggen</h2>\n" +
    "\t\t<form ng-submit=\"login(email, password)\" ng-controller=\"AppFirebaseAuthenticationController\">\n" +
    "\t\t\t<md-input-container>\n" +
    "\t\t\t\t<label>email</label>\n" +
    "\t\t        <input autofocus required type=\"email\" autocomplete=\"off\" ng-disabled=\"loginActive\" ng-model=\"email\" />\n" +
    "\t\t\t</md-input-container>\n" +
    "\t\t   <md-input-container>\n" +
    "\t\t        <label>password</label>\n" +
    "\t\t        <input required type=\"password\" ng-disabled=\"loginActive\" ng-model=\"password\" />\n" +
    "\t\t    </md-input-container>\n" +
    "\t\t\t<div layout=\"row\" layout-align=\"end center\">\n" +
    "\t\t  \t  \t<md-button class=\"md-raised md-primary\" type=\"submit\" ng-disabled=\"loginActive\">Log In</md-button> \t\n" +
    "\t\t  \t</div>\t\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('resources/templates/opdracht.html',
    "<fb-data type=\"object\" bind-to=\"opdracht\" path=\"lesopdracht/{{currentRoute.params.les}}/{{currentRoute.params.opdracht}}\"></fb-data>\n" +
    "<md-subheader class=\"md-primary\">\n" +
    "\t{{opdracht.titel}}\n" +
    "</md-subheader>\n" +
    "<md-divider></md-divider>\n" +
    "<md-content>\n" +
    "\t<opdracht les=\"{{currentRoute.params.les}}\" id=\"{{currentRoute.params.opdracht}}\"></opdracht>\n" +
    "\t<md-divider></md-divider>\n" +
    "\t<div layout=\"row\"  layout-align=\"end center\">\n" +
    "\t\t<md-checkbox ng-model=\"opdracht.done\">\n" +
    "\t\t\tklaar\n" +
    "\t\t</md-checkbox>\n" +
    "\t\t<md-button class=\"md-raised md-primary\" type=\"button\" ng-click=\"goBack()\">\n" +
    "\t\t\tok\n" +
    "\t\t</md-button>\n" +
    "\t</div>\n" +
    "</md-content>"
  );

}]);
