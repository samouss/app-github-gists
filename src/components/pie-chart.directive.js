(function() {

  /**
  * Pie chart directive module
  */
  angular
    .module('pie-chart.directive', [
    ])
    .directive('pieChart', [
      'd3',
      PieChart
    ])
  ;

  /**
   * [PieChart description]
   * @param {[type]} d3 [description]
   */
  function PieChart(d3) {
    return {
      scope: {
        data: '='
      },
      restrict: 'E',
      template: '<div id="chart"></div>',
      link: function($scope, iElm, iAttrs, controller) {
        var width = 360,
            height = 360,
            legendRectSize = 18,
            legendSpacing = 4,
            innerRadius = 75,
            outerRadius = Math.min(width, height) / 2,
            color = d3.scale.category20c();

        var svg = d3
          .select('#chart')
          .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
              .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
        ;

        var arc = d3.svg.arc()
          .innerRadius(outerRadius - innerRadius)
          .outerRadius(outerRadius)
        ;

        var pie = d3.layout.pie()
          .value(function(d) { return d.count; })
          .sort(null)
        ;

        var path = svg
          .selectAll('path')
          .data(pie($scope.data))
          .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
              return color(d.data.language);
            })
        ;

        var legend = svg
          .selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing,
                  offset =  height * color.domain().length / 2,
                  horz = -2 * legendRectSize,
                  vert = i * height - offset;

              return 'translate(' + horz + ',' + vert + ')';
            })
        ;

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color)
        ;

        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d; })
        ;


      }
    };
  }

}());