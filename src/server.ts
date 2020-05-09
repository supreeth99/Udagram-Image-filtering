import express from 'express';
import {Request, Response} from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
   app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );

  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    const image_url: string = req.query.image_url;
    if (!image_url) {
      res.status(400).send("Please provide an image URL.");
      return;
    }
    const imagePath: string = await filterImageFromURL(image_url);
    res.sendFile(imagePath);
    res.on('finish', () => deleteLocalFiles([imagePath]));
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();