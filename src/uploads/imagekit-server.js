const ImageKit = require('imagekit');
const express = require("express");

const imagekit = new ImageKit({
    publicKey: "",
    privateKey: "",
    urlEndpoint: ""
});


function imagekitAuth (req, res) {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}

module.exports = {
    imagekitAuth
}