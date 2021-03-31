d3.json("data.json", function (data) {
        var height = window.innerHeight,
            width = window.innerWidth,
            radius = 5;

        var svg = d3.select("#network").append("svg")
          .attr("height", height)
          .attr("width", width)
          .call(d3.zoom()
            .on("zoom", function () {
            svg.attr("transform", d3.event.transform)
          }))
          .append("g")

        // svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "black");

        svg.append("text").text('REDDIT')
          .attr("x", (175))
          .attr("y",(85))
          .attr("opacity", 0.7)
          .attr("font-family", "Titillium Web")
          .attr("letter-spacing", "0.5em")
          .attr("font-style", "normal")
          .attr("text-anchor", "middle")
          .style("font-size", "40px")
          .style("fill", "white")


        var simulation = d3.forceSimulation()
  				.nodes(data.nodes);
        simulation
          .force("charge_force", d3.forceManyBody()
            .strength(-50))
          .force("center_force", d3.forceCenter(width / 2, height / 2))
      		.force('collide', d3.forceCollide()
            .radius(20)
            .iterations(1)
          )

        var drag = d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);

        var maxNodeValue = d3.max(returnNodeValues(data));
        var minNodeValue = d3.min(returnNodeValues(data));

        function returnNodeValues(data) {
          var array = [];
          for (var i = 0; i < data.nodes.length; i++) {
            array.push(data.nodes[i].value);
          }
          return array;
        }

        var label = svg.append("g")
          .attr("class", "labels")
          .attr("font-family", "Titillium Web")


          .attr("fill", "white")
          .attr("font-size", "15px")

          .selectAll("text")
          .data(data.nodes)
          .enter().append("text")
            .attr("dy", function(d) {
              return -(d.value / 200 +9)
            })
            .attr("text-anchor", "middle")
            .attr("letter-spacing", "0.25em")
            .attr("class", function(d) {
              return d.name
            })

            // .on("mouseover", function(d) {
            //   .attr("opacity", "1")
            //   .text(d.name)
            // })
            .attr("opacity", "0")
            .text(function(d) {
              return d.name
            });


        //draw circles for the nodes
        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter()
          .append("circle")
            .attr("opacity", function(d) {

              if (minNodeValue == 0) {
                minNodeValue = 0.001
              }
              result = (d.value/minNodeValue) / (maxNodeValue / minNodeValue)

              return result + 0.2
            })
            .attr("fill", "white")
            .attr('r', function(d) {
              return d.value / 200 +2;
            })
            .call(drag).on("click", click)
            .on("mouseover", function(d)
               {
                d3.select(`.${d.name}`).attr("opacity","1")
               })
              .on("mouseout", function(d)
               {
                   d3.select(`.${d.name}`).attr("opacity","0")
               })

            // .on("mouseover", function(d)
            // {
            //   d3.select(this)
            //       .style("opacity", 0.3)
            //       .style("width", function(d) { return x(d) + "px"; })
            //       .text(function(d) { return d.name; })
            //       .on("mouseover", function(d){tooltip.text(d.name); return tooltip.style("visibility", "visible");})
            //       .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            //       .on("mouseout", function(){return tooltip.style("visibility", "hidden").style("opacity", "1");});
            //
            // })
            // .on("mouseout", function(d)
            //  {
            //      d3.select(this)
            //          .style("opacity", 1)
            //  })
            //
            // .on("click", function(d) {
            //     // Select the circle being moused over
            //     d3.select(this)
            //         .attr("fill", "white")
            //         .style("opacity", "0.86");
            //   });
        // var tooltip = d3.select("body")
        //     .append("div")
        //     .style("position", "absolute")
        //     .style("z-index", "10")
        //     .style("visibility", "hidden")
        //     .style("background", "#FFFFFF")
        //     .style("opacity", "0.8")
        //     .text("a simple tooltip");


          // d3.select('.nodes').append("text")
          //   .attr('text-anchor', 'middle')
          //   .attr("dx", 12)
          //   .attr("dy", ".35em")
          //   // .attr('alignment-baseline', 'middle')
          //   .style('font-size', "10px")
          //   .attr('fill-opacity', 1)
          //   .attr('fill', 'white')
          //   .text("test")
            //
            // .on('mouseover', function (d, i) {
            //      d3.select(this).transition()
            //           .duration('50')
            //           .attr('opacity', '.2');
            // })
            // .on('mouseout', function(d,i) {
            //   d3.select(this).transition()
            //     .duration('50')
            //     .attr('opacity', '0');
            // })

        // var texts = d3.select('.nodes').append("text")
        //   .attr('text-anchor', 'middle')
        //   .attr("x", (175))
        //   .attr("y",(85))
        //   .attr('alignment-baseline', 'middle')
        //   .style('font-size', "10px")
        //   .attr('fill-opacity', 1)
        //   .attr('fill', 'white')
        //   .text("test")

        simulation.on("tick", tickActions );

        var link_force =  d3.forceLink(data.links)
          .id(function(d) { return d.name; })
          .distance(200)

        simulation.force("links",link_force)

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr('stroke-width', function(d) {
              return d.value / 50;
            })
            // .style("stroke", "#ff0000")
            .style("stroke", function(d) {
              if (d.sentiment == 10) {
                return "#ff0000"
              } else if (d.sentiment == 9) {
                return "#eb3900"
              } else if (d.sentiment == 8) {
                return "#d64f00"
              } else if (d.sentiment == 7) {
                return "#c15d00"
              } else if (d.sentiment == 6) {
                return "#ac6700"
              } else if (d.sentiment == 5) {
                return "#956f00"
              } else if (d.sentiment == 4) {
                return "#7e7500"
              } else if (d.sentiment == 3) {
                return "#647a00"
              } else if (d.sentiment == 2) {
                return "#457d00"
              } else if (d.sentiment == 1) {
                return "#008000"
              } else {
                return "#008000"
              }
            })
        function tickActions() {
            //update circle positions each tick of the simulation
            node
                .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            label
              .attr("x", function(d) { return d.x; })
              .attr("y", function (d) { return d.y; })
              // .style("font-size", "10px").style("fill", "#333");
        }

        function handleMouseOver(d, i) {  // Add interactivity
          // Use D3 to select element, change color and size
          d3.select(this).attr({
            fill: "orange",
            r: radius * 2
          });

          // Specify where to put label of text
          svg.append("text").attr({
             id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
              x: function() { return xScale(d.x) - 30; },
              y: function() { return yScale(d.y) - 15; }
          })
          .text(function() {
            return [d.x, d.y];  // Value of the text
          });
        }

        function click(event, d) {
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            simulation.alpha(1).restart();
        }

       function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }


    })