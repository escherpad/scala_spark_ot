require("should");

it('renders without crashing', () => {
  ({test:true}).should.have.property('test');
});


