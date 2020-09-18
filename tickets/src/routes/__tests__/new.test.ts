import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";

it("has a route listening to post requests to /api/tickets", async (): Promise<
  void
> => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});
it("access if user is signed in", async (): Promise<void> => {
  await request(app).post("/api/tickets").send({}).expect(401);
});
it("returns a status not equal to 401 when signed in", async (): Promise<
  void
> => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "kjshkjsd", price: 21 });
  expect(res.status).not.toEqual(401);
});
it("error if invalid title", async (): Promise<void> => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ price: 12 })
    .expect(401);
});
it("error if invalid price", async (): Promise<void> => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "lkjsdklj" })
    .expect(401);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "lkjsdklj", price: -123 })
    .expect(401);
});
it("creates a ticket with valid inputs", async (): Promise<void> => {});
