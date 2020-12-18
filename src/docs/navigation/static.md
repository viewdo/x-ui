# Static Routing

Static content routing uses a simple declarative approach. Just put the content for your route within a ```x-view``` tag and set the url.

> Content won't be displayed until the URL path matches the path set in the ```x-view```.

````html
<x-view url="/home"
  page-title="Home">
  ... home content ...
</x-view>
````

## Nested Routes

Routes go as deep as you need.
  
<ion-item>
  <ion-icon slot="start" name="git-merge-outline"></ion-icon>
  <x-link href="/navigation/static/nesting">
    Go Deeper on Nested Routes
  </x-link>
  <ion-icon slot="end" color="success"
    x-show-when="didVisit('/navigation/static/nesting')" 
    name="checkbox-outline"></ion-icon>
</ion-item>

## Data Routes

Using routes to provide data to views is also possible.

<ion-item>
  <ion-icon slot="start" name="server-outline"></ion-icon>
  <x-link href="/navigation/static/data">
    Using Data Routes
  </x-link>
  <ion-icon slot="end" color="success"
    x-show-when="didVisit('/navigation/static/data')" 
    name="checkbox-outline"></ion-icon>
</ion-item>