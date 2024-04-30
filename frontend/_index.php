<?php

    $cmd = "find ./output -name 'ffout*.png'";
    exec($cmd, $files);

    $cmd = "magick " . implode(" ", $files) . " -evaluate-sequence mean output.png";
    shell_exec($cmd);

    echo $cmd;
    echo $files;
?>

<html>
    <head>
        <title>Beiboot-Projekt</title>
        <link rel="stylesheet" href="/styles.scss">
    </head>
    <body>
        <h1>Überschrift</h1>
        ffmpeg -i movies/IMG_2941.mov -vf scale=1600:-1 -r 20 output/ffout%3d.png

        <div class="upload"></div>

        <div class="download"></div>
    </body>
</html>
