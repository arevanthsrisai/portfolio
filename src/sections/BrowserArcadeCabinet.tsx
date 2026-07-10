import { useCallback, useEffect, useRef } from 'react';

interface GameState {
  screen: 'title' | 'game';
  score: number;
  lives: number;
  level: number;
}

export default function BrowserArcadeCabinet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    screen: 'title',
    score: 0,
    lives: 3,
    level: 1,
  });
  const requestRef = useRef<number>(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = Math.min(window.innerWidth / 800, window.innerHeight / 600, 1);
    canvas.style.width = `${760 * scale}px`;
    canvas.style.height = `${520 * scale}px`;
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game physics
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 40;
    let ballDX = 4;
    let ballDY = -4;
    const ballRadius = 8;
    const paddleHeight = 15;
    const paddleWidth = 100;
    let paddleX = (canvas.width - paddleWidth) / 2;

    // Input tracking
    let rightPressed = false;
    let leftPressed = false;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Brick setup
    const brickRowCount = 6;
    const brickColumnCount = 10;
    const brickWidth = 64;
    const brickHeight = 20;
    const brickPadding = 8;
    const brickOffsetTop = 40;
    const brickOffsetLeft = 35;

    const bricks: { x: number; y: number; status: number; color: string }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
          x: 0,
          y: 0,
          status: 1,
          color: `hsl(${r * 60}, 70%, 50%)`,
        };
      }
    }

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status !== 1) continue;
          if (
            ballX > b.x &&
            ballX < b.x + brickWidth &&
            ballY > b.y &&
            ballY < b.y + brickHeight
          ) {
            ballDY = -ballDY;
            b.status = 0;
            gameStateRef.current.score += 10;
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#C3F73A';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight - 10,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status !== 1) continue;
          const b = bricks[c][r];
          b.x = c * (brickWidth + brickPadding) + brickOffsetLeft;
          b.y = r * (brickHeight + brickPadding) + brickOffsetTop;
          ctx.beginPath();
          ctx.rect(b.x, b.y, brickWidth, brickHeight);
          ctx.fillStyle = b.color;
          ctx.fill();
          ctx.closePath();
        }
      }
    };

    const drawScore = () => {
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = '#E0E0E0';
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 16, 24);
    };

    const drawLives = () => {
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = '#E0E0E0';
      ctx.fillText(
        `Lives: ${gameStateRef.current.lives}`,
        canvas.width - 140,
        24
      );
    };

    const draw = () => {
      if (gameStateRef.current.screen === 'title') {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '40px "Press Start 2P"';
        ctx.fillStyle = '#FF6B6B';
        ctx.textAlign = 'center';
        ctx.fillText("REVANTH'S", canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillStyle = '#C3F73A';
        ctx.fillText('ARCADE', canvas.width / 2, canvas.height / 2 + 20);

        if (Math.floor(Date.now() / 500) % 2 === 0) {
          ctx.font = '20px "Press Start 2P"';
          ctx.fillStyle = '#C3F73A';
          ctx.fillText(
            'INSERT COIN (Space)',
            canvas.width / 2,
            canvas.height / 2 + 80
          );
        }

        ctx.textAlign = 'start';
        return;
      }

      if (gameStateRef.current.screen === 'game') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        // Wall collision
        if (
          ballX + ballDX > canvas.width - ballRadius ||
          ballX + ballDX < ballRadius
        ) {
          ballDX = -ballDX;
        }

        // Top collision
        if (ballY + ballDY < ballRadius) {
          ballDY = -ballDY;
        }

        // Bottom collision
        if (
          ballY + ballDY >
          canvas.height - ballRadius - paddleHeight - 10 + 5
        ) {
          if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
          } else {
            gameStateRef.current.lives--;
            if (gameStateRef.current.lives <= 0) {
              gameStateRef.current.screen = 'title';
              gameStateRef.current.score = 0;
              gameStateRef.current.lives = 3;
              // Reset bricks
              for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                  bricks[c][r].status = 1;
                }
              }
            }
            ballX = canvas.width / 2;
            ballY = canvas.height - 40;
            ballDX = 4;
            ballDY = -4;
          }
        }

        ballX += ballDX;
        ballY += ballDY;

        if (rightPressed && paddleX < canvas.width - paddleWidth)
          paddleX += 7;
        if (leftPressed && paddleX > 0) paddleX -= 7;
      }
    };

    const render = () => {
      draw();
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    const spaceHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameStateRef.current.screen === 'title') {
        gameStateRef.current.screen = 'game';
        gameStateRef.current.score = 0;
        // Reset bricks
        for (let c = 0; c < brickColumnCount; c++) {
          for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
          }
        }
      }
    };
    document.addEventListener('keydown', spaceHandler);

    return () => {
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      document.removeEventListener('keydown', spaceHandler);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Marquee */}
      <div className="relative overflow-hidden bg-[#0B0C10] border-2 border-[#FF6B6B] rounded-lg px-8 py-3">
        <div className="flex items-center gap-2 animate-pulse-glow">
          <span className="font-arcade text-[#FF6B6B] text-sm tracking-wider">
            REVANTH&apos;S WORK
          </span>
        </div>
      </div>

      {/* Arcade Cabinet */}
      <div className="relative bg-black border-8 border-gray-700 rounded-lg p-4 shadow-2xl w-[800px] h-[600px] max-w-full">
        {/* Screen bezel details */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-gray-600" />
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={760}
          height={520}
          className="bg-[#050510] block mx-auto rounded cursor-crosshair"
        />
      </div>

      {/* Controls hint */}
      <p className="text-[#8A8D9F] text-sm font-body">
        Use{' '}
        <kbd className="px-2 py-1 bg-[#1F2833] rounded text-[#C3F73A] font-arcade text-xs">
          ←
        </kbd>{' '}
        <kbd className="px-2 py-1 bg-[#1F2833] rounded text-[#C3F73A] font-arcade text-xs">
          →
        </kbd>{' '}
        to move |{' '}
        <kbd className="px-2 py-1 bg-[#1F2833] rounded text-[#C3F73A] font-arcade text-xs">
          SPACE
        </kbd>{' '}
        to start
      </p>
    </div>
  );
}