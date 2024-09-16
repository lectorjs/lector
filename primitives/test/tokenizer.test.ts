import { describe, expect, it } from "vitest";
import { tokenize } from "../src/tokenizer.ts";

describe("tokenizer", () => {
    it("tokenizes text", () => {
        expect(tokenize("Hello world")).toEqual(["Hello", "world"]);
    });

    it("works with empty text", () => {
        expect(tokenize("")).toEqual([]);
    });

    it("works with white spaces", () => {
        expect(tokenize("     ")).toEqual([]);
    });

    it("works with multiple spaces between words", () => {
        expect(tokenize("Hello   world")).toEqual(["Hello", "world"]);
        expect(tokenize("Hello           world")).toEqual(["Hello", "world"]);
    });

    it("handles leading and trailing spaces", () => {
        expect(tokenize("  Hello world  ")).toEqual(["Hello", "world"]);
    });

    it("handles newlines", () => {
        expect(tokenize("Hello\nworld")).toEqual(["Hello", "world"]);
    });

    it("handles multiple newlines", () => {
        expect(tokenize("Hello\n\nworld")).toEqual(["Hello", "world"]);
    });

    it("handles tabs", () => {
        expect(tokenize("Hello\tworld")).toEqual(["Hello", "world"]);
    });

    it("handles multiple tabs", () => {
        expect(tokenize("Hello\t\tworld")).toEqual(["Hello", "world"]);
    });

    it("handles multiple tabs and newlines", () => {
        expect(tokenize("Hello\n\t\tworld")).toEqual(["Hello", "world"]);
    });

    it("handles punctuation", () => {
        expect(tokenize("Hello, world!")).toEqual(["Hello,", "world!"]);
    });

    it("handles numbers", () => {
        expect(tokenize("123 456")).toEqual(["123", "456"]);
    });

    it("handles mixed alphanumeric", () => {
        expect(tokenize("abc123 def456")).toEqual(["abc123", "def456"]);
    });

    it("handles apostrophes", () => {
        expect(tokenize("don't won't")).toEqual(["don't", "won't"]);
    });

    it("handles contractions", () => {
        expect(tokenize("I'll we've they're")).toEqual(["I'll", "we've", "they're"]);
    });

    it("handles possessives", () => {
        expect(tokenize("John's book")).toEqual(["John's", "book"]);
    });

    it("handles special characters", () => {
        expect(tokenize("Hello @world #hashtag $money %percent ^caret &and *star")).toEqual([
            "Hello",
            "@world",
            "#hashtag",
            "$money",
            "%percent",
            "^caret",
            "&and",
            "*star",
        ]);
    });

    it("handles emojis", () => {
        expect(tokenize("Hello 😊 world 🌍")).toEqual(["Hello", "😊", "world", "🌍"]);
    });

    it("handles URLs", () => {
        expect(tokenize("Visit https://example.com")).toEqual(["Visit", "https://example.com"]);
    });

    it("handles email addresses", () => {
        expect(tokenize("Contact user@example.com")).toEqual(["Contact", "user@example.com"]);
    });

    it("handles mixed case", () => {
        expect(tokenize("HeLLo WoRLD")).toEqual(["HeLLo", "WoRLD"]);
    });

    it("handles non-breaking space", () => {
        expect(tokenize("Hello\u00A0world")).toEqual(["Hello", "world"]);
    });

    it("handles zero-width space", () => {
        expect(tokenize("Hello\u200Bworld")).toEqual(["Hello\u200Bworld"]);
    });

    it("handles multiple paragraphs", () => {
        expect(tokenize("First paragraph.\n\nSecond paragraph.")).toEqual([
            "First",
            "paragraph.",
            "Second",
            "paragraph.",
        ]);
    });

    it("handles quotation marks", () => {
        expect(tokenize('"Hello," she said.')).toEqual(['"Hello,"', "she", "said."]);
    });

    it("handles parentheses", () => {
        expect(tokenize("Hello (world)")).toEqual(["Hello", "(world)"]);
    });

    it("handles multiple punctuation", () => {
        expect(tokenize("Hello!?!?")).toEqual(["Hello!?!?"]);
    });

    it("handles math expressions", () => {
        expect(tokenize("2+2=4")).toEqual(["2+2=4"]);
    });

    it("handles underscores", () => {
        expect(tokenize("hello_world")).toEqual(["hello_world"]);
    });

    it("handles mixed spaces and tabs", () => {
        expect(tokenize("Hello \t \t world")).toEqual(["Hello", "world"]);
    });
});
