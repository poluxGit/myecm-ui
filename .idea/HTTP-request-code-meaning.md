# Codes de statut du protocole HTTP
```
Code	Message officiel, selon la RFC 2616 (avec notre traduction)
Explications (résumé tiré de la RFC 2616)
Source : JDN (base RFC 2616/W3C)
```
## Codes commençant par 1	Information	Indique une réponse provisoire.


|Code|Http Message|Signification|
|----|------------|-------------|
|100|Continue ("Continue")|Le client doit continuer avec sa requête.|
|101|Switching Protocols ("Changement de protocole")|	Changement de protocole accepté par le serveur. Mais le protocole ne devra être changé que s'il est avantageux de le faire.|


## Codes commençant par 2	Succès	Indique que la requête a été reçue, comprise et acceptée.

|Code|Http Message|Signification|
|----|------------|-------------|
|200|	OK|	Tout va bien, tout est normal : la requête a été traitée avec succès :-)|
|201|	Created ("Créé")|	Requête traitée avec succès, et une nouvelle ressource a été créée.|
|202|	Accepted ("Accepté")|	Requête acceptée, mais son traitement n'est pas terminé.|
|203|	Non-Authoritative Information ("Information ne faisant pas autorit")|	Requête traitée avec succès mais les données transmises ne sont pas conformes aux originales, et proviennent d'une copie locale ou d'un tiers.|
|204|	No Content ("Pas de contenu")|	Requête traitée avec succès, mais le serveur n'a pas besoin de transmettre de contenu.|
|205|	Reset Content ("Rétablir le contenu")	|Indique au navigateur de supprimer le contenu des champs d'un formulaire.|
|206|	Partial Content ("Contenu partiel")|	Le serveur a partiellement satisfait à la demande GET pour la ressource (réponse à une requête comportant l'en-tête "Range").|

## Codes commençant par 3	Redirection	Indique qu'une action supplémentaire doit être entreprise par l'agent d'utilisateur afin de satisfaire la demande.

|Code|Http Message|Signification|
|----|------------|-------------|
|301|	Moved Permanently ("Déplacement définitif")|	Redirection permanente : les ressources demandées se trouvent à une nouvelle adresse (l'URL demandée peut être oubliée).
|302|	Moved Temporarily ("Déplacement temporaire")| dans la RFC 1945 (HTTP/1.0). Sinon Found ("Trouvé") dans la RFC 2616 (HTTP/1.1) qui a ajouté les codes 303 et 307.	Sens le plus commun : redirection temporaire. Les ressources se trouvent à une nouvelle adresse, mais l'URL demandée doit continuer à être utilisée par le client. Selon la RFC 2616, la réponse du serveur doit seulement indiquer l'URL où la ressource peut être trouvée. Mais la RFC 2616, comme la RFC 1945, moins récente, précisent bien que le client n'est pas autorisé à changer la méthode de la demande redirigée. Cependant, les 302 sont souvent traitées comme des 303...|
|303|	See Other ("Voir autre")|	La réponse à la requête peut être trouvée à une autre url en utilisant GET.|
|304|	Not Modified ("Non modifié")|	Le client dispose d'une copie à jour de la ressource demandée.|
|305|	Use Proxy ("Utiliser un mandataire/proxy")|	La ressource demandée n'est accessible que via un proxy.|
|307|	Temporary Redirect ("Redirection temporaire")|	Redirection temporaire (légère variante de l'erreur 302 souvent mal interprétée comme une 303, et justement introduite pour éviter cette confusion, l'erreur 307 indique qu'il faut garder la même méthode, POST par exemple).|


## Codes commençant par 4	Erreur du client	Indique que le navigateur semble s'être trompé.
|Code|Http Message|Signification|
|----|------------|-------------|
|400|	Bad Request ("Mauvaise demande")|	La requête n'a pas été comprise en raison de sa syntaxe.|
|401|	Unauthorized ("Non autorisé")|	La requête nécessite l'authentification de l'utilisateur.|
|403|	Forbidden ("Interdit")|	La requête est valide, mais le serveur refuse d'y répondre (il a été paramétré pour cela, et cela peut être lié à un problème d'autorisation).|
|404|	Not Found ("Non trouvé")|	Le serveur n'a rien trouvé correspondant à l'url demandée. Rien ne précise si c'est temporaire, mais si c'est définitif, l'erreur 410 est préférable.|
|405|	Method Not Allowed ("Méthode non admise")|	La méthode (GET, POST) n'est pas supportée par la ressource demandée.|
|406|	Not Acceptable ("Pas acceptable")|	La ressource n'est pas conforme à la demande.|
|408|	Request Timeout ("Délai écoulé pour la requête")|	Le client n'a pas produit assez vite la requête attendue par le serveur, mais peut la produire plus tard.|
|410|	Gone ("Page indisponible définitivement"|	La ressource demandée n'est plus disponible, a fortiori de façon définitive (sinon la 404 est préférable) et le serveur ne sait pas vers où renvoyer|

## Codes commençant par 5	Erreur du serveur	Indique que le serveur web n'a pas réussi à traiter une requête pourtant valide (une mauvaise nouvelle à transmettre aux services techniques du site en général...)
|Code|Http Message|Signification|
|----|------------|-------------|
|500|	Internal Server Error ("Erreur interne du serveur")|	Message générique : aucune précision n'est possible, mais le serveur a rencontré un problème inattendu qui l'a empêché de traiter la requête avec succès.|
|501|	Not Implemented ("Non mis en oeuvre")|	Le serveur ne supporte pas la fonctionnalité requise pour traiter avec succès la requête (ou ne reconnaît pas la requête).|
|502|	Bad Gateway ou Proxy Error ("Mauvaise passerelle")|	Le serveur agissait comme un intermédiaire (passerelle ou proxy) et une mauvaise réponse lui a été envoyée par un autre serveur.|
|503|	Service Unavailable ("Service indisponible")|	Indisponibilité en général temporaire du serveur, à cause d'une maintenance ou d'une surcharge.|
|504|	Gateway Time-out ("Expiration de la passerelle")|	Le serveur agissait comme un intermédiaire (passerelle ou proxy) et il n'a pas eu de réponse d'un autre serveur dans les temps.|
|505|	HTTP Version not supported ("Code d'extension de version HTTP non prise en charge")|	Le serveur ne supporte pas la version du protocole HTTP utilisée dans la requête.|
