# Team-Project-31

## Proposal 1 - Chrome Extension for Active Phishing Detection

### Introduction

A Chrome browser extension that leverages machine learning to provide active phishing detection by scanning webpages that the user navigates to.

### Abstract

Phishing campaigns are growing increasingly prevalent. A major form of action being taken to counteract these phishing campaigns are "education," in which companies dedicate time and resources to teach employees how to recognize a phishing attempt. In addition, active email filters are commonly used that filter against phishing as well spam and as maintaining DLP.

However, even the most educated human can be fooled, and phishing often occurs outside of email. Most prominently, a common form of phishing are fake login pages wherein an attacker hosts a login page that is similar or identical to a legitimate site in effort to steal login credentials. For example, an attacker can host a fake Facebook login page at a domain like "facebook.help-supp0rtt.info" that harvests any credentials that a victim user attempts to enter.

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
