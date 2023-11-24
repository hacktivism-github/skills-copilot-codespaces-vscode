// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create server
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    if (request.method == 'GET' && pathname == '/comments') {
        // Read comments.json file and send it back to client
        fs.readFile('comments.json', 'utf8', function(err, data) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(data);
        });
    }
    else if (request.method == 'POST' && pathname == '/comments') {
        // Read request body and parse it as JSON
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);

            // Read comments.json file and append new comment to it
            fs.readFile('comments.json', 'utf8', function(err, data) {
                var comments = JSON.parse(data);
                comments.push(post);
                fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(comments));
                });
            });
        });
    }
    else {
        // Return 404 error
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found');
    }
}).listen(8888);

console.log('Server running at http://localhost:8888/');

// Path: index.html
<!DOCTYPE html>
<html>
    <head>
        <title>Comments</title>
        <meta charset="utf-8" />
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    </head>
    <body>
        <div id="comments"></div>
        <form id="commentForm">
            <input type="text" name="author" placeholder="Name" />
            <input type="text" name="text" placeholder="Comment" />
            <input type="submit" value="Submit" />
        </form>
        <script>
            $(document).ready(function() {
                // Get comments from server and display them
                $.ajax
