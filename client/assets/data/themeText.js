
const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};

const width = 654;
const height = 1240;

export default class LastMayday {
  palette() {
    return ({
      width: '654rpx',
      height: '1240rpx',
      background: '#ffffff',
      views: [
        {
          id: 'orginText',
          type: 'text',
          text: `I agree with this statement that young people make decisions about their own lives is better. Decisions made by parents and students is a controversial problem for a long time. Everyone is a unique individual and has the right to decide themselves. I will give two points to support my opinion.\nFirst, make decisions for themselves can cultivate the child's independence. Parents can't stay with child forever so child must be independent to support his own life. As an independent person, society will need them even more. Take my sister for an example, she is a director of a company now. She had achieved complete mental and financial independence in the college and she was responsible for her choices. Her success was not depends on her parents decisions but on herself.\nSecond is about the way of making decisions . Different Times make different ways of thinking. The individual decisions of young people are more conform to the needs of society. The idea of parents is that child have to finish college and then force them go to a company. According to the development of today’s society, higher degrees lead to better jobs and salary. Although the decision of parents is good for their children, but they are not the same era after all, and their thoughts will inevitably be different.
          // All in all, people make decisions about their own lives are more benefit than their parents make decisions for them.`,
          // text: `I agree with this statement that young people make decisions about their own lives is better. Decisions made `,
          css: {
            top: `${startTop}rpx`,
            align: 'left',
            width: `${width - startLeft * 2}rpx`,
            lineHeight: `40rpx`,
            background: '#f2f2f2',
            textAlign: 'left',
            padding: '40rpx',
            fontSize: '30rpx',
            left: `${startLeft}rpx`
          },
        },
        {
          id: 'bottom',
          type: 'rect',
          css: {
            top: [`${startTop * 4 / 3}rpx`, 'orginText'],
            left: 0,
            width: `${width}rpx`,
            height: `${200 + startTop * 2}rpx`,
            color: '#ffffff',
          },
        },
        {
          type: 'image',
          url: 'https://wx3.sinaimg.cn/orj360/9f7ff7afgy1g9ac39aptdj20by0by0uv.jpg',
          css: {
            top: [`${startTop * 2}rpx`, 'orginText'],
            left: `${(width - 170) / 2}rpx`,
            width: '170rpx',
            height: '170rpx',
            rotate: 0,
          },
        },
        {
          // id: 'title',
          type: 'text',
          text: "语法老师",
          css: {
            width: `${width}rpx`,
            left: `${width / 2}rpx`,
            bottom: `${startTop * 4 / 3}rpx`,
            fontWeight: 'bold',
            fontSize: '30rpx',
            color: 'rgba(95,139,250,1)',
            align: 'center',
            textAlign: 'center',
          },
        },
      ],
    });
  }
}

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: '/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        shadow: '10rpx 10rpx 5rpx #888888',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
