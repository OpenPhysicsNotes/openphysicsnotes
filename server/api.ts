
import express from "express";

function hello(req: express.Request, res: express.Response, next: express.NextFunction) {
	//res.contentType("application/json");
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify({
		hello: "world!",
		your_query: req.query
	}));
	res.end();
}

function answer(req: express.Request, res: express.Response, next: express.NextFunction) {
	res.send(JSON.stringify({
		answer: 42
	}));
	res.end();
}

function default_api(req: express.Request, res: express.Response, next: express.NextFunction) {
	next();
}

export function setup_opn_api(app : express.Application) {

	app.get("/api/hello", hello);

	app.get("/api/answer", answer);

	app.get("/api/*", default_api);

	//app.get("/api", default_api, hello);

}