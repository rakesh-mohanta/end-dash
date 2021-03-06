require('../support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require('../../lib/end-dash').Backbone,
    generateTemplate = require("../support/generate_template");

describe("A collection template", function() {
  describe("when I bind to the collection", function() {
    beforeEach(function () {
      this.things = new Backbone.Collection([
        new Backbone.Model({ type: "awesome" }),
        new Backbone.Model({ type: "cool" })
      ]);

      this.markup = fs.readFileSync(__dirname + "/templates/polymorphic.html").toString();
      this.template = generateTemplate({ things: this.things }, this.markup);
    });

    it("should change the item when the type changes", function() {
      expect($(".things- .thing-:nth-child(1)").html()).to.be("awesome");
      expect($(".things- .thing-:nth-child(2)").html()).to.be("cool");

      expect($(".things- .thing-:nth-child(1)").hasClass("whenAwesome-")).to.be(true);
      expect($(".things- .thing-:nth-child(2)").hasClass("whenCool-")).to.be(true);

      this.things.at(0).set("type", "cool");
      this.things.at(1).set("type", "awesome");

      expect($(".things- .thing-:nth-child(1)").html()).to.be("cool");
      expect($(".things- .thing-:nth-child(2)").html()).to.be("awesome");

      expect($(".things- .thing-:nth-child(1)").hasClass("whenCool-")).to.be(true);
      expect($(".things- .thing-:nth-child(2)").hasClass("whenAwesome-")).to.be(true);
    });

    it("should remove the correct element on remove even if the element has moved", function() {
      var model = this.things.last();
      expect($(".things- .thing-:nth-child(2)").html()).to.be("cool");
      var el = $(".things- .thing-:nth-child(2)");
      // move cool from second position to the first position (outside of endDash)
      el.insertBefore($('.things- .thing-:nth-child(1)'));
      //we expect the first one to be cool now
      expect($('.things- .thing-:nth-child(1)').html()).to.be('cool');
      // then we remove cool
      this.things.remove(model);
      // and expect the first one to be awesome
      expect($(".things- .thing-:nth-child(1)").html()).to.be("awesome");
    });

  });
});
