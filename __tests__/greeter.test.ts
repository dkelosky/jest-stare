import { Greeter } from "../src/greeter";

it("Should greet with message", () => {
  const greeter = new Greeter("friend");
  expect(greeter.greet()).toBe("Bonjour, friend!");
});
