import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";

export default function SpaceInvadersGame() {
  const canvasRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing');
  const [player, setPlayer] = useState({ x: 250, y: 460 });
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const shootSound = useRef(null);
  const enemyHitSound = useRef(null);

  useEffect(() => {
    shootSound.current = new Audio('/shoot.wav');
    enemyHitSound.current = new Audio('/enemy-hit.wav');
  }, []);

  useEffect(() => {
    const createEnemies = (count) => {
      const newEnemies = [];
      for (let i = 0; i < count; i++) {
        newEnemies.push({ x: 60 * (i % 10), y: 50 + 50 * Math.floor(i / 10), boss: false, dx: 2 });
      }
      newEnemies.push({ x: 200, y: 20, boss: true, dx: 1 });
      return newEnemies;
    };
    setEnemies(createEnemies(5 * Math.pow(2, level - 1)));
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayer(p => ({ ...p, x: Math.max(0, p.x - 20) }));
      } else if (e.key === 'ArrowRight') {
        setPlayer(p => ({ ...p, x: Math.min(480, p.x + 20) }));
      } else if (e.key === ' ') {
        shootSound.current.play();
        setBullets(b => [...b, { x: player.x + 10, y: player.y - 10 }]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');

    function draw() {
      context.clearRect(0, 0, 500, 500);
      context.fillStyle = 'white';
      context.fillRect(player.x, player.y, 20, 20);

      bullets.forEach(b => context.fillRect(b.x, b.y, 4, 10));
      enemyBullets.forEach(b => {
        context.fillStyle = 'red';
        context.fillRect(b.x, b.y, 4, 10);
      });

      enemies.forEach(e => {
        context.fillStyle = e.boss ? 'red' : 'green';
        context.fillRect(e.x, e.y, 30, 20);
      });

      context.fillStyle = 'white';
      context.fillText(`Lives: ${lives}`, 10, 490);
      context.fillText(`Score: ${score}`, 400, 490);
    }

    function update() {
      setBullets(prev => prev.map(b => ({ ...b, y: b.y - 5 })).filter(b => b.y > 0));

      setEnemies(prevEnemies => prevEnemies.map(e => {
        const newX = e.x + e.dx;
        return { ...e, x: (newX > 470 || newX < 0) ? e.x - e.dx : newX, dx: (newX > 470 || newX < 0) ? -e.dx : e.dx };
      }));

      setEnemies(prevEnemies => prevEnemies.filter(e => {
        const hit = bullets.some(b => b.x >= e.x && b.x <= e.x + 30 && b.y >= e.y && b.y <= e.y + 20);
        if (hit) {
          setScore(s => s + (e.boss ? 100 : 10));
          enemyHitSound.current.play();
        }
        return !hit;
      }));

      setEnemyBullets(prev => prev.map(b => ({ ...b, y: b.y + 5 })).filter(b => b.y <= 500));

      enemyBullets.forEach(b => {
        if (b.x >= player.x && b.x <= player.x + 20 && b.y >= player.y && b.y <= player.y + 20) {
          setLives(l => l - 1);
          setEnemyBullets([]);
        }
      });

      if (Math.random() < 0.02 && enemies.length > 0) {
        const shooter = enemies[Math.floor(Math.random() * enemies.length)];
        setEnemyBullets(b => [...b, { x: shooter.x + 15, y: shooter.y + 20 }]);
      }

      if (lives <= 0) {
        setGameState('game-over');
      }

      if (enemies.length === 0 && gameState === 'playing') {
        setGameState('level-complete');
        setTimeout(() => {
          setLevel(l => l + 1);
          setGameState('playing');
        }, 1000);
      }
    }

    draw();
    update();

    const interval = setInterval(() => {
      draw();
      update();
    }, 100);

    return () => clearInterval(interval);
  }, [player, bullets, enemies, enemyBullets, lives, gameState]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-4">Space Invaders - Level {level}</h1>
      <canvas ref={canvasRef} width={500} height={500} className="border border-white" />
      {gameState === 'level-complete' && (
        <p className="text-green-400 mt-4">Level Complete! Advancing...</p>
      )}
      {gameState === 'game-over' && (
        <p className="text-red-400 mt-4">Game Over! Final Score: {score}</p>
      )}
      <Button onClick={() => window.location.reload()} className="mt-4">Restart Game</Button>
    </div>
  );
}
