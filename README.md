# Team-Project-31

## Proposal 1 - Chrome Extension for Active Phishing Detection

### Introduction

A Chrome browser extension that leverages machine learning to provide active phishing detection by scanning webpages that the user navigates to.

### Abstract

Phishing campaigns are growing increasingly prevalent. A major form of action being taken to counteract these phishing campaigns are "education," in which companies dedicate time and resources to teach employees how to recognize a phishing attempt. In addition, active email filters are commonly used that filter against phishing as well spam and as maintaining DLP.

However, these are insufficient as even the most educated human can be fooled, and phishing often occurs outside of email. Most prominently, a common form of phishing are fake login pages wherein an attacker hosts a login page that is similar or identical to a legitimate site in effort to steal login credentials. For example, an attacker can host a fake Facebook login page at a domain like "facebook.help-supp0rtt.info" that harvests any credentials that a victim user attempts to enter.

This project addresses this problem by providing a Chrome browser extension that scans webpages for phishing by providing navigated webpages into a trained phishing detection model and alerts the user if it detects a webpage to be a phishing page.

### Approach

The proposed approach is to have a Chrome extension and a backend server that hosts the phishing detection model. An alternative is instead of a server, have the ML model exist as a native application on the user's own device.

There are several approaches to detection that may be used complimentarily of each other including but limited to using URL, HTTP content, HTML content, and/or screenshots of the webpages.

URL based detection is the simplest, but can miss a lot of positives which is why additional data should be used. Therefore, the pages' HTML and related HTTP content should also be used. Screenshots may be necessary since much page content often only is visible after JavaScript is executed, meaning just using the HTML alone may not be sufficient.

Generally, the following steps are taken:
1. User browses to a webpage
2. Chrome extension sends webpage's URL, HTML, HTTP, and screenshot to detection model
3. Detection model responds with confidence
4. If confident, Chrome extension alerts user

### Persona

Any internet user to protect them from falling victim to phishing

### Dataset links

Potential datasets to use:
- https://archive.ics.uci.edu/ml/datasets/Phishing+Websites
- https://www.kaggle.com/akashkr/phishing-website-dataset
- https://github.com/GregaVrbancic/Phishing-Dataset
- https://gregavrbancic.github.io/Phishing-Dataset/
- Many more...



## Proposal 2 - Fake Art Digital Museum

### Introduction

A website that generates new artwork for a user to peruse in the style of various popular painters.

### Abstract

During the covid lockdowns, we lost the ability to do indoor activities outside our home. Various technologies blossomed during these restrictions to help connect people or amuse them while they were at home. Museums were affected by lockdowns and started holding virtual exhibits so members could experience the art while at home. Even now people have to self quarantine for various reasons and use the internet to alleviate some of their boredom.

Immersive art exhibits have become more popular in recent years. For example teamLab have appeared frequently on social media. There are immersive exhibits like the Van Gogh experience in San Francisco. To bring this to users, we will use a generative model to make novel artwork in the style of various artists through a website.

### Approach
The application will work as such:
1. a GANs model is trained on various painters to be able to product artworks of different styles.
2. The trained model is used to generate artworks for a website
3. The website can be created through a Flask app
4. Everytime a user access the app a new set of paintings are shown


### Persona

Any internet user interested in art.

### Dataset links
1. https://www.kaggle.com/c/gan-getting-started/data
2. Data from wikiart.org https://academictorrents.com/details/1d154cde2fab9ec8039becd03d9bb877614d351b

## Proposal 3 - Music Genre Classification

### Introduction
A portal that lets users upload a music sample file and predicts its genre

### Abstract

Music is loved by all but everyone's choice is different. Some prefer classical or some like heavy beats like rock. The idea is to built a python machine learning model to automatically predict the genre of the music sample uploaded. The sample's time duration and frequencies can be the parameters used in identifing for the classification.

For this we used the data set having similar frequiencies and audio tracks with similar size. GTZAN is the reccomended dataset for this model training which was complied for the use of genre classification.

### Approach
The application will work as such:
1. GTZAN dataset is trained by using K-Nearest Neighbours and clustering.
2. The trained model is used to predict the genre of uploaded file
3. The website can be created through a Flask app
4. Reccomendation of songs can be also provided

### Dataset links
http://marsyas.info/downloads/datasets.html
